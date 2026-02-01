import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params;
    const token =
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    const response = await fetch(
      `${API_URL}/assignment-groups/${id}/users/${userId}`,
      {
        method: "DELETE",
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

    const text = await response.text();
    if (!text) {
      return new NextResponse(null, { status: response.status });
    }
    const data = JSON.parse(text) as unknown;
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error removing user from assignment group:", error);
    return NextResponse.json(
      { error: "Error al quitar usuario" },
      { status: 500 }
    );
  }
}
