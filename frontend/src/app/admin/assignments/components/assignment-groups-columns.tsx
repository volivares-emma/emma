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
import { MoreHorizontal } from "lucide-react";
import type { CourseAssignmentGroup } from "@/types/course";

interface AssignmentGroupsColumnsProps {
  onEdit: (group: CourseAssignmentGroup) => void;
  onDelete: (group: CourseAssignmentGroup) => void;
}

export function createAssignmentGroupsColumns({
  onEdit,
  onDelete,
}: AssignmentGroupsColumnsProps): ColumnDef<CourseAssignmentGroup>[] {
  return [
    {
      accessorKey: "name",
      header: "Asignación",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{group.name}</span>
            <span className="text-xs text-muted-foreground">
              {group.course?.title || `Curso #${group.course_id}`}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: {
          [key: string]: "default" | "secondary" | "destructive" | "outline";
        } = {
          pending: "outline",
          in_progress: "secondary",
          completed: "default",
          expired: "destructive",
        };
        return (
          <Badge variant={variants[status] || "outline"}>
            {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        );
      },
    },
    {
      accessorKey: "assignments",
      header: "Usuarios",
      cell: ({ row }) => {
        const count = row.original.assignments?.length || 0;
        return <span>{count}</span>;
      },
    },
    {
      accessorKey: "due_date",
      header: "Vencimiento",
      cell: ({ row }) => {
        const dueDate = row.getValue("due_date") as string;
        if (!dueDate) return <span className="text-muted-foreground">-</span>;
        return new Date(dueDate).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(group)}>
                Editar asignación
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(group)}
                className="text-destructive"
              >
                Eliminar asignación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
