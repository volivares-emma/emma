// app/api/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: obtener subscription por id
export async function GET( request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const subscription = await prisma.tbl_subscriptions.findUnique({
      where: { id: idNum },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: actualizar subscription por id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const payload = await request.json();
    // Actualizar en DB
    const updatedSubscription = await prisma.tbl_subscriptions.update({
      where: { id: idNum },
      data: payload,
    });

    return NextResponse.json(updatedSubscription, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: eliminar subscription por id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    await prisma.tbl_subscriptions.delete({ where: { id: idNum } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
