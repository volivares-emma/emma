import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: agregar nueva nota a contacto
export async function POST(
  request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const contactId = Number(id);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await request.json();
    const contact = await prisma.tbl_contacts.findUnique({
      where: { id: contactId },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }

    const notes = Array.isArray(contact.notes) ? contact.notes : [];
    const newNote = {
      id: Date.now(),
      text: body.text,
      createdBy: body.createdBy || "sistema",
    };

    const updatedNotes = [...notes, newNote];
    await prisma.tbl_contacts.update({
      where: { id: contactId },
      data: { notes: updatedNotes },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/contacts/[id]/notes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET: obtener todas las notas de un contacto
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const contactId = Number(id);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const contact = await prisma.tbl_contacts.findUnique({
      where: { id: contactId },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }
    const notes = Array.isArray(contact.notes) ? contact.notes : [];
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/contacts/[id]/notes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PATCH: editar nota existente
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const contactId = Number(id);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await request.json();
    const noteId = body.id;
    const newText = body.text;
    if (!noteId || !newText) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const contact = await prisma.tbl_contacts.findUnique({
      where: { id: contactId },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }
    const notes = Array.isArray(contact.notes) ? contact.notes : [];
    const updatedNotes = notes.map((n: any) =>
      n.id === noteId ? { ...n, text: newText } : n
    );
    await prisma.tbl_contacts.update({
      where: { id: contactId },
      data: { notes: updatedNotes },
    });
    return NextResponse.json({ id: noteId, text: newText }, { status: 200 });
  } catch (error) {
    console.error("Error en PATCH /api/contacts/[id]/notes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar nota existente
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const contactId = Number(id);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await request.json();
    const noteId = body.id;
    if (!noteId) {
      return NextResponse.json(
        { error: "ID de nota requerido" },
        { status: 400 }
      );
    }
    const contact = await prisma.tbl_contacts.findUnique({
      where: { id: contactId },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }
    const notes = Array.isArray(contact.notes) ? contact.notes : [];
    const updatedNotes = notes.filter((n: any) => n.id !== noteId);
    await prisma.tbl_contacts.update({
      where: { id: contactId },
      data: { notes: updatedNotes },
    });
    return NextResponse.json({ id: noteId }, { status: 200 });
  } catch (error) {
    console.error("Error en DELETE /api/contacts/[id]/notes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
