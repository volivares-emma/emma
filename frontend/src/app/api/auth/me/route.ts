import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('access_token')?.value?.trim();
    const headerToken = request.headers
      .get('authorization')
      ?.replace(/^Bearer\s+/i, '')
      .trim();
    const token = cookieToken || headerToken;

    console.log('/api/auth/me - Token encontrado:', !!token);

    if (!token) {
      console.log('/api/auth/me - No hay token, retornando 401');
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Llamar al backend para obtener datos del usuario
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('/api/auth/me - Respuesta del backend:', response.status);

    if (!response.ok) {
      console.log('/api/auth/me - Token inválido, retornando 401');
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const user = await response.json();
    console.log('/api/auth/me - Usuario obtenido:', user.username);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('/api/auth/me - Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}
