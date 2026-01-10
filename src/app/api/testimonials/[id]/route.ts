import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: obtener testimonio por id
export async function GET( request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const testimonial = await prisma.tbl_testimonials.findUnique({ where: { id: idNum } });

    if (!testimonial) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: actualizar testimonio por id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const payload = await request.json();

    // Mapear campos del frontend al modelo de DB
    const mappedPayload = {
      name: payload.name,
      position: payload.position,
      company: payload.company,
      content: payload.content,
      rating: payload.rating,
      is_active: payload.isActive !== undefined ? payload.isActive : true,
      is_featured: payload.isFeatured !== undefined ? payload.isFeatured : false,
    };

    // Remover campos undefined para evitar errores
    Object.keys(mappedPayload).forEach(key => {
      if (mappedPayload[key as keyof typeof mappedPayload] === undefined) {
        delete mappedPayload[key as keyof typeof mappedPayload];
      }
    });

    const updatedTestimonial = await prisma.tbl_testimonials.update({
      where: { id: idNum },
      data: mappedPayload,
    });
    
    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: eliminar testimonio por id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    await prisma.tbl_testimonials.delete({ where: { id: idNum } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
