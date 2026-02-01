import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize");
    const limit = searchParams.get("limit");
    const courseId = searchParams.get("course_id");
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    const token =
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    const params = new URLSearchParams();
    params.set("page", page);
    if (limit) params.set("limit", limit);
    if (pageSize) params.set("pageSize", pageSize);
    if (courseId) params.set("course_id", courseId);
    if (userId) params.set("user_id", userId);
    if (status) params.set("status", status);

    const response = await fetch(`${API_URL}/assignments?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Error al obtener asignaciones" },
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

    const response = await fetch(`${API_URL}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Error al crear asignación" },
      { status: 500 }
    );
  }
}
