// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: obtener usuario por id
export async function GET( request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const user = await prisma.tbl_users.findUnique({ where: { id: idNum } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error("GET /users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: actualizar usuario solo con JSON
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const payload = await request.json();

    // Si viene password, hashearla
    if (payload.password) {
      payload.password = await bcrypt.hash(String(payload.password), 12);
    } else {
      delete payload.password;
    }

    const updatedUser = await prisma.tbl_users.update({
      where: { id: idNum },
      data: payload,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: any) {
    console.error("PUT /users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: eliminar usuario por id (y limpiar relaciones si aplica)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    await prisma.tbl_users.delete({ where: { id: idNum } });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
