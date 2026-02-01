import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

type RawSlide = Record<string, any>;

const toCamelSlide = (item: RawSlide) => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  description: item.description,
  buttonText: item.button_text,
  buttonLink: item.button_link,
  visualType: item.visual_type,
  isActive: item.is_active,
  sortOrder: item.sort_order,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  deletedAt: item.deleted_at,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(toCamelSlide(data), { status: 200 });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json(
      { error: 'Error al crear slide' },
      { status: 500 },
    );
  }
}
