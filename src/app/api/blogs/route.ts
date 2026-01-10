// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { BlogListResponse, Blog, BlogCreatePayload } from "@/types/blog";


// GET: obtener todos los blogs (paginado)
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = require("@/lib/pagination").getPaginationParams(request.url);

    const [blogsDb, total] = await Promise.all([
      prisma.tbl_blogs.findMany({
        skip,
        take: pageSize,
        orderBy: { pub_date: "desc" },
        where: { deleted_at: null, status: "published" }, // Solo blogs publicados en el frontend
        include: { author: true },
      }),
      prisma.tbl_blogs.count({ where: { deleted_at: null, status: "published" } }),
    ]);

    // Función para obtener archivos de un blog
    const fetchFiles = async (blogId: number) => {
      try {
        const files = await prisma.tbl_files.findMany({
          where: {
            related_type: "blog",
            related_id: blogId,
          },
          orderBy: { created_at: "desc" },
          take: 1, // Solo el más reciente
        });
        return files.map(f => ({
          id: f.id,
          filename: f.filename,
          path: f.path,
          related_type: f.related_type,
          related_id: f.related_id,
          createdAt: f.created_at,
          updatedAt: f.updated_at,
        }));
      } catch (error) {
        console.error(`Error fetching files for blog ${blogId}:`, error);
        return [];
      }
    };

    // Cargar archivos para cada blog
    const blogsWithFiles = await Promise.all(
      blogsDb.map(async (b: any) => {
        const files = await fetchFiles(b.id);
        return {
          id: b.id,
          title: b.title,
          description: b.description ?? undefined,
          content: b.content,
          authorId: b.author_id,
          author: b.author ? {
            id: b.author.id,
            username: b.author.username,
            password: '', // No exponer password en respuesta
            role: b.author.role,
            is_active: b.author.is_active,
            created_at: b.author.created_at,
            updated_at: b.author.updated_at
          } : undefined,
          slug: b.slug,
          status: b.status === "draft" || b.status === "published" ? b.status : "draft",
          pubDate: b.pub_date,
          createdAt: b.created_at,
          updatedAt: b.updated_at,
          files, // ✅ Agregar archivos
        };
      })
    );

    const response: BlogListResponse = {
      data: blogsWithFiles,
      page,
      pageSize,
      total,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json({ error: "Error al obtener blogs" }, { status: 500 });
  }
}

// POST: crear nuevo blog
export async function POST(request: NextRequest) {
  try {
    const payload: BlogCreatePayload = await request.json(); 
    const blogDb = await prisma.tbl_blogs.create({
      data: {
        title: payload.title,
        description: payload.description ?? null,
        content: payload.content,
        author_id: payload.authorId,
        slug: payload.slug,
        status: payload.status,
        pub_date: new Date(payload.pubDate),
      },
      include: { author: true },
    });
    const blog: Blog = {
      id: blogDb.id,
      title: blogDb.title,
      description: blogDb.description ?? undefined,
      content: blogDb.content,
      authorId: blogDb.author_id,
      author: blogDb.author ? {
        id: blogDb.author.id,
        username: blogDb.author.username,
        password: '', // No exponer password en respuesta
        role: blogDb.author.role,
        is_active: blogDb.author.is_active,
        created_at: blogDb.author.created_at,
        updated_at: blogDb.author.updated_at
      } : undefined,
      slug: blogDb.slug,
      status: blogDb.status === "draft" || blogDb.status === "published" ? blogDb.status : "draft",
      pubDate: blogDb.pub_date,
      createdAt: blogDb.created_at,
      updatedAt: blogDb.updated_at,
    };
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
