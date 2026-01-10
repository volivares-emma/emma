"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, RotateCcw, Eye } from "lucide-react";

interface CreateCertificatesColumnsProps {
  onDownload: (certificate: any) => void;
  onRegenerate: (certificate: any) => void;
}

export function createCertificatesColumns({
  onDownload,
  onRegenerate,
}: CreateCertificatesColumnsProps): ColumnDef<any>[] {
  return [
    {
      accessorKey: "user",
      header: "Destinatario",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.username}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Curso",
      cell: ({ row }) => {
        const course = row.original.course;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{course.title}</span>
            {course.category && (
              <span className="text-xs text-muted-foreground">{course.category}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "certificate_number",
      header: "Número de Certificado",
      cell: ({ row }) => {
        const number = row.getValue("certificate_number") as string;
        return (
          <Badge variant="outline" className="font-mono">
            {number}
          </Badge>
        );
      },
    },
    {
      accessorKey: "issued_at",
      header: "Fecha de Emisión",
      cell: ({ row }) => {
        const date = row.getValue("issued_at") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "valid_until",
      header: "Válido Hasta",
      cell: ({ row }) => {
        const validUntil = row.getValue("valid_until") as string;
        if (!validUntil) return <span className="text-muted-foreground">No expira</span>;
        
        const date = new Date(validUntil);
        const isExpired = date < new Date();
        
        return (
          <span className={isExpired ? "text-red-600 font-medium" : ""}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const validUntil = row.original.valid_until;
        if (!validUntil) return <Badge variant="default">Válido</Badge>;

        const isExpired = new Date(validUntil) < new Date();
        return (
          <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? "Expirado" : "Válido"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const certificate = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(certificate.certificate_number)}
              >
                Copiar número de certificado
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDownload(certificate)}>
                <Download className="mr-2 h-4 w-4" />
                Descargar certificado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRegenerate(certificate)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Regenerar certificado
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}