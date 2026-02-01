import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const FILES_BASE_URL = API_URL.replace(/\/api\/v1$/, '');

type RawFile = Record<string, any>;

const toAbsoluteFile = (item: RawFile) => {
  const path = item?.path;
  return {
    ...item,
    path: typeof path === 'string' && path.startsWith('/')
      ? `${FILES_BASE_URL}${path}`
      : path,
  };
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(toAbsoluteFile(data), { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const relatedType = searchParams.get('related_type');
    const relatedId = searchParams.get('related_id');
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    let url = `${API_URL}/files`;
    if (relatedType && relatedId) {
      url = `${API_URL}/files/related/${relatedType}/${relatedId}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return NextResponse.json(data.map(toAbsoluteFile), { status: 200 });
    }
    if (Array.isArray(data?.data)) {
      return NextResponse.json(
        { ...data, data: data.data.map(toAbsoluteFile) },
        { status: 200 },
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json([], { status: 200 });
  }
}
