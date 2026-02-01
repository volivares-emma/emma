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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = (await cookies()).get('access_token')?.value;

    const payload = {
      ...body,
      ...(body.isActive !== undefined ? { is_active: body.isActive } : {}),
      ...(body.buttonText !== undefined
        ? { button_text: body.buttonText }
        : {}),
      ...(body.buttonLink !== undefined
        ? { button_link: body.buttonLink }
        : {}),
      ...(body.visualType !== undefined
        ? { visual_type: body.visualType }
        : {}),
      ...(body.sortOrder !== undefined ? { sort_order: body.sortOrder } : {}),
    };

    if ('isActive' in payload) {
      delete (payload as { isActive?: boolean }).isActive;
    }
    if ('buttonText' in payload) {
      delete (payload as { buttonText?: string }).buttonText;
    }
    if ('buttonLink' in payload) {
      delete (payload as { buttonLink?: string }).buttonLink;
    }
    if ('visualType' in payload) {
      delete (payload as { visualType?: string }).visualType;
    }
    if ('sortOrder' in payload) {
      delete (payload as { sortOrder?: number }).sortOrder;
    }

    const response = await fetch(`${API_URL}/slides/${id}`, {
      method: 'PATCH',
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
    return NextResponse.json(toCamelSlide(data), { status: 200 });
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { error: 'Error al actualizar slide' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return PATCH(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/slides/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al eliminar slide' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(toCamelSlide(data), { status: 200 });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      { error: 'Error al eliminar slide' },
      { status: 500 },
    );
  }
}
