"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, TrendingUp, Eye } from "lucide-react";

interface CreateAssignmentsColumnsProps {
  onUpdateProgress: (assignment: any) => void;
}

export function createAssignmentsColumns({
  onUpdateProgress,
}: CreateAssignmentsColumnsProps): ColumnDef<any>[] {
  return [
    {
      accessorKey: "user",
      header: "Estudiante",
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
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
          pending: "outline",
          in_progress: "secondary",
          completed: "default",
          expired: "destructive"
        };
        return (
          <Badge variant={variants[status] || "outline"}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progreso",
      cell: ({ row }) => {
        const progress = row.original.progress;
        const percentage = progress?.progress_percentage || 0;
        return (
          <div className="flex items-center space-x-2">
            <Progress value={percentage} className="w-16" />
            <span className="text-xs text-muted-foreground min-w-[2rem]">
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "assigned_at",
      header: "Asignado",
      cell: ({ row }) => {
        const date = row.getValue("assigned_at") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "due_date",
      header: "Fecha de Vencimiento",
      cell: ({ row }) => {
        const dueDate = row.getValue("due_date") as string;
        if (!dueDate) return <span className="text-muted-foreground">-</span>;
        
        const date = new Date(dueDate);
        const isOverdue = date < new Date() && row.original.status !== 'completed';
        
        return (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const assignment = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(assignment.id.toString())}
              >
                Copiar ID de asignación
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateProgress(assignment)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Actualizar progreso
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