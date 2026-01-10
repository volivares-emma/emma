import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  Contact,
  ContactListResponse,
  ContactCreatePayload,
  ContactNote,
} from "@/types/contact";

// GET: Listar todos los contactos
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = require("@/lib/pagination").getPaginationParams(request.url);

    const [contactsDb, total] = await Promise.all([
      prisma.tbl_contacts.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.tbl_contacts.count(),
    ]);

    const data: Contact[] = contactsDb.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone ?? null,
      company: c.company ?? null,
      subject: c.subject ?? null,
      message: c.message ?? null,
      notes: (c.notes as ContactNote[]) ?? [],
      status: c.status ?? "new",
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    const response: ContactListResponse = {
      data,
      total,
      page,
      pageSize,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /contacts error:", err);
    return NextResponse.json(
      { error: "Error al obtener contactos" },
      { status: 500 }
    );
  }
}

// POST: Crear contacto
export async function POST(request: NextRequest) {
  try {
    const body: ContactCreatePayload = await request.json();
    const created = await prisma.tbl_contacts.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        company: body.company ?? null,
        subject: body.subject ?? null,
        message: body.message ?? null,
        notes: body.notes ?? [],
        status: body.status ?? "new",
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /contacts error:", err);
    return NextResponse.json(
      { error: err.message || "Error al crear contacto" },
      { status: 500 }
    );
  }
}
