"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
} from "lucide-react";
import type { Recruitment } from "@/types/recruitment";

interface RecruitmentColumnsProps {
  onEdit: (recruitment: Recruitment) => void;
  onDelete: (recruitment: Recruitment) => void;
  onStatusChange: (recruitment: Recruitment, newStatus: string) => void;
  onViewCV: (pdfUrl: string) => void;
  statusConfig: Record<string, { label: string; color: string; icon: any }>;
  getCvUrl: (recruitment: Recruitment) => string | undefined;
}

export function createRecruitmentColumns({
  onEdit,
  onDelete,
  onStatusChange,
  onViewCV,
  statusConfig,
  getCvUrl,
}: RecruitmentColumnsProps): ColumnDef<Recruitment>[] {
  return [
    {
      accessorKey: "name",
      header: "Candidato",
      cell: ({ row }) => {
        const recruitment = row.original;
        return (
          <div className="flex flex-col">
            <div className="font-medium">{recruitment.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {recruitment.email}
            </div>
            {recruitment.phone && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {recruitment.phone}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "position",
      header: "Posición",
      cell: ({ row }) => {
        const recruitment = row.original;
        return (
          <div className="flex flex-col">
            <div className="font-medium flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {recruitment.position}
            </div>
            {recruitment.jobPositionRef && (
              <div className="text-sm text-muted-foreground">
                {recruitment.jobPositionRef.department} - {recruitment.jobPositionRef.location}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experiencia",
      cell: ({ row }) => {
        const experience = row.getValue("experience") as string;
        const salaryExpectation = row.original.salaryExpectation;
        
        return (
          <div className="flex flex-col">
            {experience && (
              <div className="text-sm">{experience}</div>
            )}
            {salaryExpectation && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                S/ &nbsp;{salaryExpectation}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const config = statusConfig[status];
        const StatusIcon = config?.icon || FileText;

        return (
          <Badge className={config?.color} variant="outline">
            <StatusIcon className="w-3 h-3 mr-1" />
            {config?.label || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "cvPath",
      header: "CV",
      cell: ({ row }) => {
        const recruitment = row.original;
        const cvUrl = getCvUrl(recruitment);
        if (!cvUrl) {
          return (
            <div className="text-sm text-muted-foreground">
              Sin CV
            </div>
          );
        }
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewCV(cvUrl)}
            className="h-8"
          >
            <FileText className="h-3 w-3 mr-1" />
            Ver CV
          </Button>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const recruitment = row.original;
        const cvUrl = getCvUrl(recruitment);
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
              <DropdownMenuItem onClick={() => onEdit(recruitment)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {recruitment.email && (
                <DropdownMenuItem asChild>
                  <a href={`mailto:${recruitment.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar email
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
              {Object.entries(statusConfig).map(([key, config]) => {
                if (key === recruitment.status) return null;
                const StatusIcon = config.icon;
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onStatusChange(recruitment, key)}
                  >
                    <StatusIcon className="mr-2 h-4 w-4" />
                    {config.label}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(recruitment)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}