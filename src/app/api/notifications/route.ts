// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  Notification,
  NotificationListResponse,
  NotificationCreatePayload,
  NotificationResponse,
} from "@/types/notification";

// GET: obtener todas las notificaciones
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = require("@/lib/pagination").getPaginationParams(request.url);

    const [notificationsDb, total] = await Promise.all([
      prisma.tbl_notifications.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.tbl_notifications.count(),
    ]);

    const notifications: Notification[] = notificationsDb.map((n: any) => ({
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
    }));

    const response: NotificationListResponse = {
      data: notifications,
      page,
      pageSize,
      total,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /notifications error:", err);
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 });
  }
}

// POST: crear nueva notificación
export async function POST(request: NextRequest) {
  try {
    const body: NotificationCreatePayload = await request.json();
    const created = await prisma.tbl_notifications.create({
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
      id: created.id,
      title: created.title,
      description: created.description ?? "",
      notificationType: created.notification_type,
      actionUrl: created.action_url ?? undefined,
      actionText: created.action_text ?? undefined,
      isActive: created.is_active,
      dismissible: created.dismissible,
      showOnPages: created.show_on_pages,
      createdAt: created.created_at.toISOString(),
      updatedAt: created.updated_at.toISOString(),
    };
    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("POST /notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
