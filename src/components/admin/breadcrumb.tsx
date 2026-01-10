"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Panel de Control",
  "/admin/users": "Usuarios",
  "/admin/courses": "Cursos",
  "/admin/assignments": "Asignaciones", 
  "/admin/certificates": "Certificados",
  "/admin/reports": "Reportes",
  "/admin/settings": "Configuración",
  "/admin/account": "Mi Cuenta",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  // Dividir la ruta en segmentos
  const segments = pathname.split("/").filter(Boolean);
  
  // Si estamos en /admin raíz, no mostrar breadcrumb
  if (pathname === "/admin") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Panel de Control</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Construir breadcrumbs dinámicamente
  const breadcrumbs = segments.reduce((acc, segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = breadcrumbMap[path] || segment.replace("-", " ");
    
    acc.push({
      path,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      isLast: index === segments.length - 1
    });
    
    return acc;
  }, [] as Array<{ path: string; label: string; isLast: boolean }>);

  return (
    <Breadcrumb className="flex-1 min-w-0">
      <BreadcrumbList className="flex-wrap sm:flex-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <BreadcrumbItem className={`${index === 0 ? "hidden sm:flex" : "flex"} items-center`}>
              {crumb.isLast ? (
                <BreadcrumbPage className="truncate max-w-[200px]">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.path} className="truncate max-w-[150px]">
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && (
              <BreadcrumbSeparator className="mx-2 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}