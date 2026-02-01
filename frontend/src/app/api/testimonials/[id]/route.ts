import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

type RawTestimonial = Record<string, any>;

const toCamelTestimonial = (item: RawTestimonial) => ({
  id: item.id,
  name: item.name,
  position: item.position,
  company: item.company,
  content: item.content,
  rating: item.rating,
  isFeatured: item.is_featured,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const toBackendPayload = (body: RawTestimonial) => ({
  name: body.name,
  content: body.content,
  position: body.position,
  company: body.company,
  rating: body.rating,
  is_featured: body.isFeatured,
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/testimonials/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(toBackendPayload(body)),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(toCamelTestimonial(data), { status: 200 });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Error al actualizar testimonio' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Error al eliminar testimonio' },
      { status: 500 },
    );
  }
}
