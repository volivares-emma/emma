"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/admin/data-table";
import {
  Plus,
  Bell,
  BellRing,
  AlertCircle,
  Info,
  Star,
  Megaphone,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { NotificationColumns } from "./components/notification-columns";
import type {
  Notification,
  NotificationListResponse,
  NotificationCreatePayload,
  NotificationUpdatePayload,
} from "@/types/notification";

// Configuración de tipos de notificación
const notificationTypes = {
  system: {
    label: "Sistema",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Activity,
  },
  news: {
    label: "Noticias",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Info,
  },
  event: {
    label: "Evento",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Star,
  },
  promotion: {
    label: "Promoción",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Megaphone,
  },
  warning: {
    label: "Advertencia",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
};

const showOnPagesOptions = {
  all: "Todas las páginas",
  home: "Solo página principal",
  specific: "Páginas específicas",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNotification, setEditNotification] = useState<Notification | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [form, setForm] = useState<NotificationCreatePayload>({
    title: "",
    description: "",
    notificationType: "system",
    actionUrl: "",
    actionText: "",
    isActive: true,
    dismissible: true,
    showOnPages: "all",
  });

  // Estadísticas calculadas
  const totalNotifications = notifications.length;
  const activeNotifications = notifications.filter((n) => n.isActive).length;
  const systemNotifications = notifications.filter(
    (n) => n.notificationType === "system"
  ).length;
  const inactiveNotifications = notifications.filter((n) => !n.isActive).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/notifications?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      const data: NotificationListResponse = await response.json();
      setNotifications(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar notificaciones", {
        description: "No se pudieron cargar las notificaciones.",
      });
    } finally {
      setLoading(false);
    }
  };
  const openDialog = (notification?: Notification) => {
    setEditNotification(notification || null);
    setForm(
      notification
        ? {
            title: notification.title || "",
            description: notification.description || "",
            notificationType: notification.notificationType || "system",
            actionUrl: notification.actionUrl || "",
            actionText: notification.actionText || "",
            isActive: notification.isActive ?? true,
            dismissible: notification.dismissible ?? true,
            showOnPages: notification.showOnPages || "all",
          }
        : {
            title: "",
            description: "",
            notificationType: "system",
            actionUrl: "",
            actionText: "",
            isActive: true,
            dismissible: true,
            showOnPages: "all",
          }
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditNotification(null);
    setForm({
      title: "",
      description: "",
      notificationType: "system",
      actionUrl: "",
      actionText: "",
      isActive: true,
      dismissible: true,
      showOnPages: "all",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editNotification
        ? `/api/notifications/${editNotification.id}`
        : "/api/notifications";
      const method = editNotification ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success(
          editNotification ? "Notificación actualizada" : "Notificación creada",
          {
            description: editNotification
              ? "La notificación se actualizó correctamente."
              : "La nueva notificación se creó correctamente.",
          }
        );
        closeDialog();
        fetchNotifications();
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      toast.error("Error al guardar", {
        description: "No se pudo guardar la notificación.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notification: Notification) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta notificación?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${notification.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Notificación eliminada", {
          description: "La notificación se eliminó correctamente.",
        });
        fetchNotifications();
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (error) {
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar la notificación.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las notificaciones del sistema y comunicaciones
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva notificación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalNotifications}
            </div>
            <p className="text-xs text-muted-foreground">
              Notificaciones registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeNotifications}
            </div>
            <p className="text-xs text-muted-foreground">Visibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {systemNotifications}
            </div>
            <p className="text-xs text-muted-foreground">Del sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {inactiveNotifications}
            </div>
            <p className="text-xs text-muted-foreground">Ocultas</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificaciones</CardTitle>
          <CardDescription>
            Gestiona todas las notificaciones del sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="grid gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={NotificationColumns({
                onEdit: openDialog,
                onDelete: handleDelete,
              })}
              data={notifications}
              searchKey="title"
              searchPlaceholder="Buscar notificaciones..."
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editNotification ? "Editar notificación" : "Nueva notificación"}
            </DialogTitle>
            <DialogDescription>
              {editNotification
                ? "Modifica los campos de la notificación y guarda los cambios."
                : "Completa el formulario para crear una nueva notificación."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Título de la notificación"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationType">Tipo de notificación *</Label>
                <Select
                  value={form.notificationType}
                  onValueChange={(value) =>
                    handleSelectChange("notificationType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(notificationTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Contenido de la notificación..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionText">Texto del botón</Label>
                <Input
                  id="actionText"
                  name="actionText"
                  value={form.actionText}
                  onChange={handleChange}
                  placeholder="Ver más, Aceptar, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionUrl">URL de acción</Label>
                <Input
                  id="actionUrl"
                  name="actionUrl"
                  value={form.actionUrl}
                  onChange={handleChange}
                  placeholder="/route, https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showOnPages">Mostrar en páginas</Label>
              <Select
                value={form.showOnPages}
                onValueChange={(value) =>
                  handleSelectChange("showOnPages", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar páginas..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(showOnPagesOptions).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive" className="flex items-center gap-2">
                  {form.isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  )}
                  Notificación activa
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dismissible"
                  checked={form.dismissible}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("dismissible", checked)
                  }
                />
                <Label
                  htmlFor="dismissible"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Puede cerrarse
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : editNotification
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
