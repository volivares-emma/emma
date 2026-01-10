import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Blog } from "@/types/blog";

// GET: obtener blog por slug
export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  
  try {
    const blogDb = await prisma.tbl_blogs.findFirst({
      where: { 
        slug: slug,
        deleted_at: null,
        status: "published" // Solo blogs publicados
      },
      include: { author: true },
    });

    if (!blogDb) {
      return NextResponse.json({ error: "Blog no encontrado" }, { status: 404 });
    }

    // Obtener archivos del blog
    const files = await prisma.tbl_files.findMany({
      where: {
        related_type: "blog",
        related_id: blogDb.id,
      },
      orderBy: { created_at: "desc" },
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
      files: files.map(f => ({
        id: f.id,
        filename: f.filename,
        path: f.path,
        related_type: f.related_type,
        related_id: f.related_id,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      })),
    };

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    console.error("[BLOGS GET BY SLUG]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}