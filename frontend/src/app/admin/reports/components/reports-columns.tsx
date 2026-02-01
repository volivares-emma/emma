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
import { MoreHorizontal, Download, Eye } from "lucide-react";

interface CreateReportsColumnsProps {
  onDownload: (reportId: string) => void;
}

export function createReportsColumns({
  onDownload,
}: CreateReportsColumnsProps): ColumnDef<any>[] {
  return [
    {
      accessorKey: "type",
      header: "Tipo de Reporte",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const typeLabels: { [key: string]: string } = {
          general: "Reporte General",
          course: "Reporte de Curso",
          user: "Reporte de Usuario",
          completion: "Reporte de Finalización"
        };
        
        return (
          <Badge variant="outline">
            {typeLabels[type] || type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <div className="font-medium">
            {title || "Reporte Sin Nombre"}
          </div>
        );
      },
    },
    {
      accessorKey: "created_by",
      header: "Generado Por",
      cell: ({ row }) => {
        const creator = row.original.creator;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {creator?.first_name} {creator?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {creator?.username}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha de Generación",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "format",
      header: "Formato",
      cell: ({ row }) => {
        const format = row.getValue("format") as string;
        return (
          <Badge variant={format === 'pdf' ? 'default' : 'secondary'}>
            {format?.toUpperCase() || 'PDF'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "file_size",
      header: "Tamaño del Archivo",
      cell: ({ row }) => {
        const fileSize = row.getValue("file_size") as number;
        if (!fileSize) return <span className="text-muted-foreground">-</span>;
        
        const formatFileSize = (bytes: number) => {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };
        
        return (
          <span className="text-sm text-muted-foreground">
            {formatFileSize(fileSize)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const report = row.original;

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
                onClick={() => navigator.clipboard.writeText(report.id.toString())}
              >
                Copiar ID de reporte
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDownload(report.id)}>
                <Download className="mr-2 h-4 w-4" />
                Descargar reporte
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