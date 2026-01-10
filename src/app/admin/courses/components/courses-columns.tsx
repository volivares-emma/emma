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
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { Course } from "@/types/course";

interface CreateCoursesColumnsProps {
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function createCoursesColumns({
  onEdit,
  onDelete,
}: CreateCoursesColumnsProps): ColumnDef<Course>[] {
  return [
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => {
        const course = row.original;
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
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => {
        const instructor = row.getValue("instructor") as string;
        return instructor || <span className="text-muted-foreground">Sin asignar</span>;
      },
    },
    {
      accessorKey: "duration_hours",
      header: "Duración",
      cell: ({ row }) => {
        const hours = row.getValue("duration_hours") as number;
        return hours > 0 ? `${hours}h` : <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
          draft: "outline",
          published: "default",
          archived: "secondary",
          inactive: "destructive"
        };
        return (
          <Badge variant={variants[status] || "outline"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Activo",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id.toString())}>
                Copy course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(course)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit course
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(course)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}