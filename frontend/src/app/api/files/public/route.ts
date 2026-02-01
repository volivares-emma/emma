import { NextRequest, NextResponse } from 'next/server';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const FILES_BASE_URL = API_URL.replace(/\/api\/v1$/, '');

type RawFile = Record<string, any>;

const toAbsoluteFile = (item: RawFile) => {
  const path = item?.path;
  return {
    ...item,
    path:
      typeof path === 'string' && path.startsWith('/')
        ? `${FILES_BASE_URL}${path}`
        : path,
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const relatedType = searchParams.get('related_type');
    const relatedId = searchParams.get('related_id');

    if (!relatedType || !relatedId) {
      return NextResponse.json([], { status: 200 });
    }

    const response = await fetch(
      `${API_URL}/files/public?related_type=${relatedType}&related_id=${relatedId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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
    return NextResponse.json(toAbsoluteFile(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json([], { status: 200 });
  }
}
