import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

type RawBlog = Record<string, any>;

const toCamelBlog = (item: RawBlog) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  content: item.content,
  authorId: item.author_id,
  author: item.author,
  slug: item.slug,
  status: item.status,
  pubDate: item.pub_date,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  deletedAt: item.deleted_at,
});

const toBackendPayload = (body: RawBlog) => ({
  title: body.title,
  description: body.description,
  content: body.content,
  author_id: body.authorId,
  slug: body.slug,
  status: body.status,
  pub_date: body.pubDate,
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/blogs/${id}`, {
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
    return NextResponse.json(toCamelBlog(data), { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Error al actualizar blog' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/blogs/${id}`, {
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
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Error al eliminar blog' },
      { status: 500 },
    );
  }
}
