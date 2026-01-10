"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Bell,
  Activity,
  Info,
  Star,
  Megaphone,
  AlertCircle,
  Globe,
  Home,
  Target,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { Notification } from "@/types/notification";

// Configuración de tipos de notificación
const notificationTypes = {
  'system': { 
    label: 'Sistema', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Activity
  },
  'news': { 
    label: 'Noticias', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Info
  },
  'event': { 
    label: 'Evento', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Star
  },
  'promotion': { 
    label: 'Promoción', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Megaphone
  },
  'warning': { 
    label: 'Advertencia', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle
  }
};

const showOnPagesConfig = {
  'all': { label: 'Todas', icon: Globe, color: 'bg-blue-100 text-blue-800' },
  'home': { label: 'Inicio', icon: Home, color: 'bg-green-100 text-green-800' },
  'specific': { label: 'Específicas', icon: Target, color: 'bg-orange-100 text-orange-800' }
};

interface NotificationColumnsProps {
  onEdit: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export const NotificationColumns = ({ onEdit, onDelete }: NotificationColumnsProps): ColumnDef<Notification>[] => [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => {
      const notification = row.original;
      return (
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium line-clamp-1">{notification.title}</div>
            {notification.description && (
              <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                {notification.description}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "notificationType",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("notificationType") as string;
      const config = notificationTypes[type as keyof typeof notificationTypes];
      
      if (!config) return <Badge variant="secondary">{type}</Badge>;
      
      const IconComponent = config.icon;
      
      return (
        <Badge className={config.color}>
          <IconComponent className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "showOnPages",
    header: "Páginas",
    cell: ({ row }) => {
      const showOnPages = row.getValue("showOnPages") as string;
      const config = showOnPagesConfig[showOnPages as keyof typeof showOnPagesConfig];
      
      if (!config) return <Badge variant="secondary">{showOnPages}</Badge>;
      
      const IconComponent = config.icon;
      
      return (
        <Badge className={config.color}>
          <IconComponent className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {isActive ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Activa
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Inactiva
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actionText",
    header: "Acción",
    cell: ({ row }) => {
      const actionText = row.getValue("actionText") as string;
      const actionUrl = row.original.actionUrl;
      
      if (!actionText && !actionUrl) {
        return <span className="text-muted-foreground text-sm">Sin acción</span>;
      }
      
      return (
        <div className="text-sm">
          {actionText && (
            <div className="font-medium">{actionText}</div>
          )}
          {actionUrl && (
            <div className="text-muted-foreground line-clamp-1 max-w-xs">
              {actionUrl}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dismissible",
    header: "Descartable",
    cell: ({ row }) => {
      const dismissible = row.getValue("dismissible") as boolean;
      return (
        <Badge variant={dismissible ? "default" : "secondary"}>
          {dismissible ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(notification)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(notification)}
              className="text-red-600 focus:text-red-600"
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