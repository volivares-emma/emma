import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { RecruitmentListResponse, Recruitment } from "@/types/recruitment";

// GET: Listar recruitments paginados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.max(Number(searchParams.get("pageSize")) || 10, 1);
    const skip = (page - 1) * pageSize;

    const [recruitmentsDb, total] = await Promise.all([
      prisma.tbl_recruitments.findMany({ skip, take: pageSize }),
      prisma.tbl_recruitments.count(),
    ]);

    const recruitments: Recruitment[] = recruitmentsDb.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone ?? null,
      position: r.position,
      experience: r.experience ?? null,
      salaryExpectation: r.salary_expectation ?? null,
      coverLetter: r.cover_letter ?? null,
      status: r.status,
      positionId: r.position_id ?? null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const response: RecruitmentListResponse = {
      data: recruitments,
      total,
      page,
      pageSize,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /recruitments error:", err);
    return NextResponse.json(
      { error: "Error al obtener recruitments" },
      { status: 500 }
    );
  }
}

// POST: Crear recruitment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.position) {
      return NextResponse.json(
        { error: "name, email y position son obligatorios" },
        { status: 400 }
      );
    }

    const created = await prisma.tbl_recruitments.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        position: body.position,
        experience: body.experience ?? null,
        salary_expectation: body.salaryExpectation ?? null,
        cover_letter: body.coverLetter ?? null,
        status: body.status ?? "new",
        position_id: body.positionId ? Number(body.positionId) : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /recruitments error:", err);
    return NextResponse.json(
      { error: err.message || "Error al crear recruitment" },
      { status: 500 }
    );
  }
}
