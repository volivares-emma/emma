import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Slide, SlideListResponse } from "@/types/slide";

// GET: listado paginado
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.max(Number(searchParams.get("pageSize")) || 10, 1);
    const skip = (page - 1) * pageSize;

    const [slidesDb, total] = await Promise.all([
      prisma.tbl_slides.findMany({
        skip,
        take: pageSize,
        orderBy: { sort_order: "asc" },
      }),
      prisma.tbl_slides.count(),
    ]);

    const slides: Slide[] = slidesDb.map((s: any) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      buttonText: s.button_text,
      buttonLink: s.button_link,
      visualType: s.visual_type,
      isActive: s.is_active,
      sortOrder: s.sort_order,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));

    const response: SlideListResponse = {
      data: slides,
      page,
      pageSize,
      total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /slides error:", err);
    return NextResponse.json(
      { error: "Error al obtener slides" },
      { status: 500 }
    );
  }
}

// POST: crear slide (solo JSON)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 }
      );
    }

    const createdSlide = await prisma.tbl_slides.create({
      data: {
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        button_text: body.buttonText ?? "Conoce más",
        button_link: body.buttonLink ?? "/about",
        visual_type: body.visualType ?? "dashboard",
        is_active: Boolean(body.isActive),
        sort_order: Number(body.sortOrder) || 0,
      },
    });

    const slideResponse: Slide = {
      id: createdSlide.id,
      title: createdSlide.title,
      subtitle: createdSlide.subtitle,
      description: createdSlide.description,
      buttonText: createdSlide.button_text,
      buttonLink: createdSlide.button_link,
      visualType: createdSlide.visual_type,
      isActive: createdSlide.is_active,
      sortOrder: createdSlide.sort_order,
      createdAt: createdSlide.created_at,
      updatedAt: createdSlide.updated_at,
    };

    return NextResponse.json(slideResponse, { status: 201 });
  } catch (err: any) {
    console.error("POST /slides error:", err);
    return NextResponse.json(
      { error: err.message || "Error al crear slide" },
      { status: 500 }
    );
  }
}
