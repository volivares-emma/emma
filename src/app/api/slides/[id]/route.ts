import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: obtener slide por id + files asociados
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const slide = await prisma.tbl_slides.findUnique({ where: { id: idNum } });
    if (!slide) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const files = await prisma.tbl_files.findMany({
      where: { related_type: "Slide", related_id: slide.id },
    });

    return NextResponse.json({ ...slide, files }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: actualizar slide (solo JSON)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updatedSlide = await prisma.tbl_slides.update({
      where: { id: idNum },
      data: {
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        button_text: body.buttonText ?? "Conoce más",
        button_link: body.buttonLink ?? "/about",
        visual_type: body.visualType ?? "dashboard",
        is_active: Boolean(body.isActive),
        sort_order: Number(body.sortOrder) || 0,
      },
    });

    const files = await prisma.tbl_files.findMany({
      where: { related_type: "Slide", related_id: updatedSlide.id },
    });

    return NextResponse.json({ ...updatedSlide, files }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: actualizar solo is_active
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);
  const body = await request.json();

  const updated = await prisma.tbl_slides.update({
    where: { id: idNum },
    data: { is_active: body.isActive },
  });

  return NextResponse.json(updated);
}

// DELETE: eliminar slide + files asociados (opcional)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const slide = await prisma.tbl_slides.findUnique({ where: { id: idNum } });
    if (!slide) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    await prisma.tbl_files.deleteMany({
      where: { related_type: "Slide", related_id: idNum },
    });
    await prisma.tbl_slides.delete({ where: { id: idNum } });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
