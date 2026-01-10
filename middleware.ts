import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirección después del login basada en rol
    if (pathname === "/login" && token) {
      if (token.role === "guest") {
        return NextResponse.redirect(new URL("/my-courses", req.url));
      } else if (["admin", "editor", "reader"].includes(token.role)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // Permitir acceso normal
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        const { pathname } = req.nextUrl;

        // Rutas públicas
        if (pathname.startsWith("/api/auth")) return true;

        // Rutas de admin - solo admin, editor y reader
        if (pathname.startsWith("/admin")) {
          return ["admin", "editor", "reader"].includes(token.role);
        }

        // Rutas de mis cursos - todos los roles autenticados
        if (pathname.startsWith("/my-courses")) {
          return ["admin", "editor", "guest", "reader"].includes(token.role);
        }

        // API protegidas
        if (pathname.startsWith("/api")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-courses/:path*",
    "/api/courses/:path*",
    "/api/users/:path*",
    "/api/assignments/:path*",
    "/api/reports/:path*",
    "/api/certificates/:path*",
    "/login",
  ],
};
