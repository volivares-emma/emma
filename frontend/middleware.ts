import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Rutas públicas
  const publicPaths = ['/login', '/about', '/blog', '/careers', '/contact', '/roadmap'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname === '/';
  
  // API routes no deben ser interceptadas por el middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Si está en login y tiene token, redirigir según rol
  if (pathname === '/login' && token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        if (user.role === 'guest') {
          return NextResponse.redirect(new URL('/my-courses', request.url));
        } else if (['admin', 'editor', 'reader'].includes(user.role)) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
    }
  }

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await response.json();
      if (!['admin', 'editor', 'reader'].includes(user.role)) {
        return NextResponse.redirect(new URL('/my-courses', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger rutas de mis cursos
  if (pathname.startsWith('/my-courses')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
