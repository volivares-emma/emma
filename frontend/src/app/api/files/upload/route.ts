import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const FILES_BASE_URL = API_URL.replace(/\/api\/v1$/, '');

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get('access_token')?.value ||
      (await cookies()).get('access_token')?.value;

    console.log('Token encontrado:', token ? 'Sí' : 'No');

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el FormData del request
    const formData = await request.formData();

    console.log('Enviando a backend:', `${API_URL}/files/upload`);

    // Reenviar el FormData al backend con el token
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error del backend:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const path = data?.path;
    const mapped = {
      ...data,
      path:
        typeof path === 'string' && path.startsWith('/')
          ? `${FILES_BASE_URL}${path}`
          : path,
    };
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error en /api/files/upload:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
