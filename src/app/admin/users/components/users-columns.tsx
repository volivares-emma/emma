"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/types/user";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

interface UserColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function getUserAvatar(user: User) {
  if (user.files && user.files.length > 0 && user.files[0].path) {
    return user.files[0].path;
  }
  return "/avatar.png";
}

export const createUserColumns = ({
  onEdit,
  onDelete,
}: UserColumnsProps): ColumnDef<User>[] => [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("id")}</div>
    ),
  },
  {
    id: "avatar",
    header: "Imagen",
    cell: ({ row }) => {
      const user = row.original as User;
      return (
        <div style={{ width: 40, height: 40 }}>
          <Image
            src={getUserAvatar(user)}
            alt={user.username}
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Usuario
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Rol
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      
      const getRoleLabel = (role: string) => {
        switch (role) {
          case "admin": return "Administrador";
          case "editor": return "Editor";
          case "reader": return "Lector";
          case "guest": return "Invitado";
          default: return role;
        }
      };

      const getRoleVariant = (role: string) => {
        switch (role) {
          case "admin": return "default";
          case "editor": return "destructive";
          case "reader": return "outline";
          case "guest": return "secondary";
          default: return "secondary";
        }
      };

      return (
        <Badge variant={getRoleVariant(role)}>
          {getRoleLabel(role)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Fecha Creación
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at") as string | null;
      if (!dateValue) {
        return <div className="text-sm text-muted-foreground">-</div>;
      }
      
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return <div className="text-sm text-muted-foreground">-</div>;
      }
      
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "dd/MM/yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Última Actualización
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("updated_at") as string | null;
      if (!dateValue) {
        return <div className="text-sm text-muted-foreground">-</div>;
      }
      
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return <div className="text-sm text-muted-foreground">-</div>;
      }
      
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "dd/MM/yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.id.toString())}
            >
              Copiar ID de usuario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-red-600"
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
