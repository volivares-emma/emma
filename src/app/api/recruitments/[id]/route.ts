
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener recruitment por id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const r = await prisma.tbl_recruitments.findUnique({ where: { id: idNum } });
    if (!r) {
      return NextResponse.json({ error: "Recruitment no encontrado" }, { status: 404 });
    }
    return NextResponse.json(r, { status: 200 });
  } catch (err) {
    console.error("GET /recruitments/[id] error:", err);
    return NextResponse.json({ error: "Error al obtener recruitment" }, { status: 500 });
  }
}

// PUT: Actualizar recruitment
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await prisma.tbl_recruitments.update({
      where: { id: idNum },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        position: body.position,
        experience: body.experience ?? null,
        salary_expectation: body.salaryExpectation ?? null,
        cover_letter: body.coverLetter ?? null,
        status: body.status,
        position_id: body.positionId ? Number(body.positionId) : null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /recruitments/[id] error:", err);
    return NextResponse.json({ error: "Error al actualizar recruitment" }, { status: 500 });
  }
}

// PATCH: Actualizar solo campos específicos (por ejemplo, status)
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const body = await request.json();
    // Solo actualiza los campos enviados en el body
    const updated = await prisma.tbl_recruitments.update({
      where: { id: idNum },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /recruitments/[id] error:", err);
    return NextResponse.json({ error: "Error al actualizar recruitment" }, { status: 500 });
  }
}

// DELETE: Eliminar recruitment y sus archivos asociados
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.tbl_files.deleteMany({
      where: { related_type: "Recruitment", related_id: idNum },
    });

    await prisma.tbl_recruitments.delete({ where: { id: idNum } });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /recruitments/[id] error:", err);
    return NextResponse.json({ error: "Error al eliminar recruitment" }, { status: 500 });
  }
}
