// app/api/job-positions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchApiProtected } from "@/utils/fetch-data";
import type {
  JobPosition,
  JobPositionCreatePayload,
  JobPositionListResponse,
} from "@/types/job-positions";
import { prisma } from "@/lib/prisma";

// GET: obtener todas las posiciones
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = require("@/lib/pagination").getPaginationParams(request.url);

    const [jobPositionsDb, total] = await Promise.all([
      prisma.tbl_job_positions.findMany({ skip, take: pageSize, orderBy: { created_at: "desc" } }),
      prisma.tbl_job_positions.count(),
    ]);

    // Mapear los campos para tipado consistente
    const data: JobPosition[] = jobPositionsDb.map((jp: any) => ({
      id: jp.id,
      title: jp.title,
      description: jp.description ?? undefined,
      department: jp.department ?? undefined,
      location: jp.location ?? undefined,
      employmentType: jp.employment_type ?? undefined,
      salaryMin: jp.salary_min ?? undefined,
      salaryMax: jp.salary_max ?? undefined,
      requirements: jp.requirements ?? undefined,
      responsibilities: jp.responsibilities ?? undefined,
      experienceMin: jp.experience_min ?? undefined,
      isActive: jp.is_active ?? undefined,
      isFeatured: jp.is_featured ?? undefined,
      createdAt: jp.created_at,
      updatedAt: jp.updated_at,
    }));
    return NextResponse.json({ data, total, page, pageSize } as JobPositionListResponse, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: crear nueva posición
export async function POST(request: NextRequest) {
  try {
    const payload: JobPositionCreatePayload = await request.json();
    const jobPositionDb = await prisma.tbl_job_positions.create({
      data: {
        title: payload.title,
        description: payload.description,
        department: payload.department,
        location: payload.location,
        employment_type: payload.employmentType,
        salary_min: payload.salaryMin,
        salary_max: payload.salaryMax,
        requirements: payload.requirements || [],
        responsibilities: payload.responsibilities || [],
        experience_min: payload.experienceMin,
      },
    });

    // Mapear los campos para tipado consistente
    const jobPosition: JobPosition = {
      id: jobPositionDb.id,
      title: jobPositionDb.title,
      description: jobPositionDb.description ?? undefined,
      department: jobPositionDb.department ?? undefined,
      location: jobPositionDb.location ?? undefined,
      employmentType: jobPositionDb.employment_type ?? undefined,
      salaryMin: jobPositionDb.salary_min ?? undefined,
      salaryMax: jobPositionDb.salary_max ?? undefined,
      requirements: jobPositionDb.requirements,
      responsibilities: jobPositionDb.responsibilities,
      experienceMin: jobPositionDb.experience_min,
      isActive: jobPositionDb.is_active,
      isFeatured: jobPositionDb.is_featured,
      createdAt: jobPositionDb.created_at,
      updatedAt: jobPositionDb.updated_at,
    };
    return NextResponse.json(jobPosition, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}