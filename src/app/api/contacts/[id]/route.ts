import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  Contact,
  ContactListResponse,
  ContactCreatePayload,
  ContactNote,
} from "@/types/contact";

// GET: Listar los contactos por id
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
    const c = await prisma.tbl_contacts.findUnique({ where: { id: idNum } });
    if (!c) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }
    const contact: Contact = {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone ?? null,
      company: c.company,
      subject: c.subject,
      message: c.message,
      notes: (c.notes as ContactNote[]) ?? [],
      status: c.status ?? "new",
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    };
    return NextResponse.json(contact, { status: 200 });
  } catch (err) {
    console.error("GET /contacts/[id] error:", err);
    return NextResponse.json(
      { error: "Error al obtener contacto" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar contacto completo
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const body = await request.json();

    // Validar campos obligatorios
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Permitir actualizar solo ciertos campos
    const updated = await prisma.tbl_contacts.update({
      where: { id: idNum },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        notes: body.notes ?? null,
        status: body.status ?? "new",
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /contacts error:", err);
    return NextResponse.json(
      { error: "Error al actualizar contacto" },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar solo campos específicos
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const body = await request.json();

    // Permitir actualizar solo ciertos campos
    const updated = await prisma.tbl_contacts.update({
      where: { id: idNum },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /contacts error:", err);
    return NextResponse.json(
      { error: "Error al actualizar contacto" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar contacto
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
    await prisma.tbl_contacts.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /contacts error:", err);
    return NextResponse.json(
      { error: "Error al eliminar contacto" },
      { status: 500 }
    );
  }
}
