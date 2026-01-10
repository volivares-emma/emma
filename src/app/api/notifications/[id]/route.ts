import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  Notification,
  NotificationCreatePayload,
  NotificationUpdatePayload,
} from "@/types/notification";

// GET: Obtener notificación por id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const n = await prisma.tbl_notifications.findUnique({ where: { id: idNum } });
    if (!n) {
      return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 });
    }
    const notification: Notification = {
      id: n.id,
      title: n.title,
      description: n.description ?? "",
      notificationType: n.notification_type,
      actionUrl: n.action_url ?? undefined,
      actionText: n.action_text ?? undefined,
      isActive: n.is_active,
      dismissible: n.dismissible,
      showOnPages: n.show_on_pages,
      createdAt: n.created_at.toISOString(),
      updatedAt: n.updated_at.toISOString(),
    };
    return NextResponse.json(notification, { status: 200 });
  } catch (err) {
    console.error("GET /notifications/[id] error:", err);
    return NextResponse.json({ error: "Error al obtener notificación" }, { status: 500 });
  }
}

// PUT: Actualizar notificación completa
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const body: NotificationCreatePayload = await request.json();
    const updated = await prisma.tbl_notifications.update({
      where: { id: idNum },
      data: {
        title: body.title,
        description: body.description ?? "",
        notification_type: body.notificationType,
        action_url: body.actionUrl ?? null,
        action_text: body.actionText ?? null,
        is_active: body.isActive ?? true,
        dismissible: body.dismissible ?? true,
        show_on_pages: body.showOnPages,
      },
    });
    const notification: Notification = {
      id: updated.id,
      title: updated.title,
      description: updated.description ?? "",
      notificationType: updated.notification_type,
      actionUrl: updated.action_url ?? undefined,
      actionText: updated.action_text ?? undefined,
      isActive: updated.is_active,
      dismissible: updated.dismissible,
      showOnPages: updated.show_on_pages,
      createdAt: updated.created_at.toISOString(),
      updatedAt: updated.updated_at.toISOString(),
    };
    return NextResponse.json(notification, { status: 200 });
  } catch (err) {
    console.error("PUT /notifications/[id] error:", err);
    return NextResponse.json({ error: "Error al actualizar notificación" }, { status: 500 });
  }
}

// PATCH: Actualizar campos específicos
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const body: NotificationUpdatePayload = await request.json();
    const updated = await prisma.tbl_notifications.update({
      where: { id: idNum },
      data: body,
    });
    const notification: Notification = {
      id: updated.id,
      title: updated.title,
      description: updated.description ?? "",
      notificationType: updated.notification_type,
      actionUrl: updated.action_url ?? undefined,
      actionText: updated.action_text ?? undefined,
      isActive: updated.is_active,
      dismissible: updated.dismissible,
      showOnPages: updated.show_on_pages,
      createdAt: updated.created_at.toISOString(),
      updatedAt: updated.updated_at.toISOString(),
    };
    return NextResponse.json(notification, { status: 200 });
  } catch (err) {
    console.error("PATCH /notifications/[id] error:", err);
    return NextResponse.json({ error: "Error al actualizar notificación" }, { status: 500 });
  }
}

// DELETE: Eliminar notificación
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    await prisma.tbl_notifications.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (err) {
    console.error("DELETE /notifications/[id] error:", err);
    return NextResponse.json({ error: "Error al eliminar notificación" }, { status: 500 });
  }
}