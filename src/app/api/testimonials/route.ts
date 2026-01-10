import { NextRequest, NextResponse } from "next/server";
import { getPaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import type {
  Testimonial,
  TestimonialListResponse,
  TestimonialCreatePayload,
  TestimonialResponse,
} from "@/types/testimonial";

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = getPaginationParams(request.url);
    const [testimonialsDb, total] = await Promise.all([
      prisma.tbl_testimonials.findMany({ skip, take: pageSize }),
      prisma.tbl_testimonials.count(),
    ]);

    // Adapta si necesitas transformar los datos
    const testimonials: Testimonial[] = testimonialsDb.map((t: any) => ({
      id: t.id,
      name: t.name,
      position: t.position,
      company: t.company,
      content: t.content,
      rating: t.rating,
      isFeatured: t.is_featured,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    const response: TestimonialListResponse = {
      data: testimonials,
      page,
      pageSize,
      total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /testimonials error:", err);
    return NextResponse.json(
      { error: "Error al obtener testimonios" },
      { status: 500 }
    );
  }
}

// POST: crear testimonio solo con JSON
export async function POST(request: NextRequest) {
  try {
    const payload: TestimonialCreatePayload = await request.json();

    // Validación básica
    if (!payload.name || !payload.content) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const created = await prisma.tbl_testimonials.create({
      data: {
        name: payload.name,
        content: payload.content,
        position: payload.position ?? null,
        company: payload.company ?? null,
        rating: payload.rating ?? 5,
        is_featured: payload.isFeatured ?? false,
        is_active: true,
      },
    });

    // Adapta si necesitas transformar los datos
    const testimonial: TestimonialResponse = {
      id: created.id,
      name: created.name,
      content: created.content,
      position: created.position,
      company: created.company,
      rating: created.rating,
      isFeatured: created.is_featured,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };

    return NextResponse.json(testimonial, { status: 201 });
  } catch (err: any) {
    console.error("POST /testimonials error:", err);
    return NextResponse.json(
      { error: err.message || "Error al crear testimonio" },
      { status: 500 }
    );
  }
}
