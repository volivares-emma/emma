// web/utils/fetch-data.ts

import { NextResponse } from "next/server"; // Importa NextResponse
import type { NextRequest } from "next/server";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";



/**
 * Función que crea headers de autenticación con el token de la cookie
 * @param request La solicitud Next.js
 * @returns Un objeto de headers con la autorización, si está presente
 */
export function getAuthHeaders(
  request: NextRequest,
  skipContentType = false
): Record<string, string> {
  const cookie = request.cookies.get("access_token")?.value;
  const headers: Record<string, string> = {};

  if (!skipContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (cookie) {
    headers["Authorization"] = `Bearer ${cookie}`;
  }

  return headers;
}

/**
 * Función base para hacer llamadas a la API
 * @param endpoint El endpoint de la API
 * @param options Opciones adicionales para la solicitud
 * @param credentials Tipo de credenciales a usar
 * @returns La respuesta de la solicitud fetch
 */

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  credentials: RequestCredentials = "include"
) {
  const isFormData = options.body instanceof FormData;

  // headers base solo si NO es FormData
  const baseHeaders: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options.headers || {}),
    },
    credentials,
  });
}

/**
 * Wrapper de fetchApi que incluye automáticamente headers de autenticación
 * y lógica de renovación de token.
 * @param request La solicitud Next.js
 * @param endpoint El endpoint de la API
 * @param options Opciones adicionales para la solicitud
 * @returns La respuesta de la solicitud fetch
 */
export async function fetchApiProtected(
  request: NextRequest,
  endpoint: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;

  // 🔹 No content-type si es FormData
  const authHeaders = getAuthHeaders(request, isFormData);

  let response = await fetchApi(endpoint, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (response.status === 401) {
    console.warn("Access token expirado, intentando refrescar...");

    const refreshResponse = await fetchApi("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      console.log("Tokens renovados, reintentando petición original.");

      const newAuthHeaders = getAuthHeaders(request, isFormData);

      response = await fetchApi(endpoint, {
        ...options,
        headers: {
          ...newAuthHeaders,
          ...(options.headers || {}),
        },
        credentials: "include",
      });
    } else {
      console.error("No se pudo renovar el token. Sesión expirada.");
      return NextResponse.json(
        { message: "Sesión expirada. Por favor, inicie sesión de nuevo." },
        { status: 401 }
      );
    }
  }

  return response;
}