import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { first_name, last_name, email, phone } = await req.json();

    // Verificar si el email ya existe (excepto el usuario actual)
    if (email) {
      const existingUser = await prisma.tbl_users.findFirst({
        where: {
          email: email,
          NOT: {
            id: parseInt(session.user.id)
          }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "El email ya está en uso" },
          { status: 400 }
        );
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.tbl_users.update({
      where: { id: parseInt(session.user.id) },
      data: {
        first_name: first_name || null,
        last_name: last_name || null,
        email: email || null,
        phone: phone || null,
        updated_at: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        role: true,
        avatar_url: true,
        created_at: true,
        is_active: true
      }
    });

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.tbl_users.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        role: true,
        avatar_url: true,
        created_at: true,
        is_active: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}