import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type RawNotification = Record<string, any>;

const toCamelNotification = (item: RawNotification) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  notificationType: item.notification_type,
  actionUrl: item.action_url,
  actionText: item.action_text,
  isActive: item.is_active,
  dismissible: item.dismissible,
  showOnPages: item.show_on_pages,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const toBackendPayload = (body: RawNotification) => ({
  title: body.title,
  description: body.description,
  notification_type: body.notificationType,
  action_url: body.actionUrl,
  action_text: body.actionText,
  is_active: body.isActive,
  dismissible: body.dismissible,
  show_on_pages: body.showOnPages,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize");
    const limit = searchParams.get("limit");

    const token =
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    const params = new URLSearchParams();
    params.set("page", page);
    if (limit) params.set("limit", limit);
    if (pageSize) params.set("pageSize", pageSize);

    const response = await fetch(
      `${API_URL}/notifications?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    const mapped = {
      ...data,
      data: Array.isArray(data?.data)
        ? data.data.map(toCamelNotification)
        : [],
    };
    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token =
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    const response = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(toBackendPayload(body)),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(toCamelNotification(data), { status: 200 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Error al crear notificación" },
      { status: 500 }
    );
  }
}
