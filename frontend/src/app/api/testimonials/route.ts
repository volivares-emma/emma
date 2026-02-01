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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(
      `${API_URL}/testimonials?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { data: [], total: 0, page: 1, limit: 10 },
        { status: 200 },
      );
    }

    const data = await response.json();
    const mapped = {
      ...data,
      data: Array.isArray(data?.data)
        ? data.data.map(toCamelTestimonial)
        : [],
    };
    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { data: [], total: 0, page: 1, limit: 10 },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const payload = {
      name: body.name,
      content: body.content,
      position: body.position,
      company: body.company,
      rating: body.rating,
      is_featured: body.isFeatured,
    };

    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(toCamelTestimonial(data), { status: 200 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Error al crear testimonio' },
      { status: 500 },
    );
  }
}
