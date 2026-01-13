import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Blog, BlogCreatePayload, BlogUpdatePayload } from "@/types/blog";

// GET: obtener blog por id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // AWAIT params
  const idNum = Number(id);
  
  try {
    const blogDb = await prisma.tbl_blogs.findUnique({
      where: { id: idNum },
      include: { author: true },
    });

    if (!blogDb || blogDb.deleted_at) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

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

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    console.error("[BLOGS GET]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT: actualizar completamente un blog
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // AWAIT params
  const idNum = Number(id);

  try {
    const payload: BlogCreatePayload = await request.json();
    
    const blogDb = await prisma.tbl_blogs.update({
      where: { id: idNum },
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

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    console.error("[BLOGS PUT]", error);
    return NextResponse.json(
      { error: "Error al actualizar blog" },
      { status: 500 }
    );
  }
}

// PATCH: actualizar parcialmente un blog
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // AWAIT params
  const idNum = Number(id);

  try {
    const payload: BlogUpdatePayload = await request.json();

    const updateData: any = {};
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.authorId !== undefined) updateData.author_id = payload.authorId;
    if (payload.slug !== undefined) updateData.slug = payload.slug;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.pubDate !== undefined) updateData.pub_date = new Date(payload.pubDate);

    const blogDb = await prisma.tbl_blogs.update({
      where: { id: idNum },
      data: updateData,
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

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    console.error("[BLOGS PATCH]", error);
    return NextResponse.json(
      { error: "Error al actualizar blog" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar (soft delete) un blog
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // AWAIT params
  const idNum = Number(id);

  try {
    await prisma.tbl_blogs.update({
      where: { id: idNum },
      data: { deleted_at: new Date() },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[BLOGS DELETE]", error);
    return NextResponse.json(
      { error: "Error al eliminar blog" },
      { status: 500 }
    );
  }
}