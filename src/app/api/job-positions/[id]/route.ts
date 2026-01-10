import { NextRequest, NextResponse } from "next/server";
import type {
  JobPosition,
  JobPositionUpdatePayload,
} from "@/types/job-positions";
import { prisma } from "@/lib/prisma";

// GET: obtener por id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
 try {
     const { id } = await context.params;
     const idNum = Number(id);
    if (!idNum) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

     const r = await prisma.tbl_job_positions.findUnique({ where: { id: idNum } });
    if (!r) {
      return NextResponse.json({ error: "Job Position no encontrado" }, { status: 404 });
    }

    const jobPosition: JobPosition = {
      id: r.id,
      title: r.title,
      description: r.description ?? null,
      department: r.department ?? null,
      location: r.location,
      employmentType: r.employment_type,
      salaryMin: r.salary_min ?? null,
      salaryMax: r.salary_max ?? null,
      requirements: r.requirements,
      responsibilities: r.responsibilities,
      experienceMin: r.experience_min,
      isActive: r.is_active,
      isFeatured: r.is_featured,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };

    return NextResponse.json(jobPosition, { status: 200 });
  } catch (err) {
    console.error("GET /job-positions/[id] error:", err);
    return NextResponse.json({ error: "Error al obtener job position" }, { status: 500 });
  }
}

// PUT: actualizar por id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
      const { id } = await context.params;
      const idNum = Number(id);
    if (!idNum) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const updated = await prisma.tbl_job_positions.update({
      where: { id: idNum },
      data: {
        title: body.title,
        description: body.description ?? null,
        department: body.department ?? null,
        location: body.location,
        employment_type: body.employmentType,
        salary_min: body.salaryMin ?? null,
        salary_max: body.salaryMax ?? null,
        requirements: body.requirements ?? undefined,
        responsibilities: body.responsibilities ?? undefined,
        experience_min: body.experienceMin ?? undefined,
        is_active: body.isActive ?? undefined,
        is_featured: body.isFeatured ?? undefined,
      },
    });

      const jobPosition: JobPositionUpdatePayload = {
        id: updated.id,
        title: updated.title,
        description: updated.description ?? undefined, 
        department: updated.department ?? undefined,
        location: updated.location,
        employmentType: updated.employment_type,  
        salaryMin: updated.salary_min ?? undefined,
        salaryMax: updated.salary_max ?? undefined,
        requirements: updated.requirements,
        responsibilities: updated.responsibilities,
        experienceMin: updated.experience_min ?? undefined,
        isActive: updated.is_active ?? undefined,
        isFeatured: updated.is_featured ?? undefined,
      };

    return NextResponse.json(jobPosition, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: eliminar por id
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.tbl_job_positions.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
