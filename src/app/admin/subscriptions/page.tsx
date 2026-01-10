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
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Clock,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import { createSubscriptionColumns } from "./components/subscriptions-columns";
import { toast } from "sonner";
import type {
  Subscription,
  SubscriptionCreatePayload,
  SubscriptionUpdatePayload,
} from "@/types/subscription";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(
    null
  );
  const [form, setForm] = useState<SubscriptionCreatePayload>({
    email: "",
    type: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Estadísticas calculadas
  const totalSubscriptions = totalItems;
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;
  const inactiveSubscriptions = subscriptions.filter(
    (s) => s.status === "unsubscribed"
  ).length;
  const recentSubscriptions = subscriptions.filter((subscription) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(subscription.createdAt) > oneWeekAgo;
  }).length;

  // Estadísticas por tipo
  const generalSubscriptions = subscriptions.filter(
    (s) => s.type === "general"
  ).length;
  const careerSubscriptions = subscriptions.filter(
    (s) => s.type === "career"
  ).length;
  const blogSubscriptions = subscriptions.filter(
    (s) => s.type === "blog"
  ).length;

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/subscriptions?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptions(data.data || data.subscriptions || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar suscripciones", {
        description: "No se pudieron cargar las suscripciones.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (subscription?: Subscription) => {
    setEditSubscription(subscription || null);
    setForm(
      subscription
        ? {
            email: subscription.email,
            type: subscription.type,
          }
        : {
            email: "",
            type: "general",
          }
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditSubscription(null);
    setForm({
      email: "",
      type: "general",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editSubscription
        ? `/api/subscriptions/${editSubscription.id}`
        : "/api/subscriptions";
      const method = editSubscription ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error en la operación");
      }

      toast.success(
        editSubscription ? "Suscripción actualizada" : "Suscripción creada",
        {
          description: editSubscription
            ? "La suscripción se actualizó correctamente."
            : "La nueva suscripción se creó correctamente.",
        }
      );

      fetchSubscriptions();
      closeDialog();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en la operación", {
        description: "No se pudo completar la operación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (subscription: Subscription) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar la suscripción de ${subscription.email}?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      toast.success("Suscripción eliminada", {
        description: "La suscripción se eliminó correctamente.",
      });

      fetchSubscriptions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar la suscripción.",
      });
    }
  };

  const columns = createSubscriptionColumns(openDialog, handleDelete);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suscripciones</h1>
          <p className="text-muted-foreground">
            Gestiona las suscripciones de usuarios a newsletters y notificaciones
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nueva suscripción
        </Button>
      </div>

      {/* 4 Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Todas las suscripciones
            </p>
          </CardContent>
        </Card>

        {/* Activas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Suscripciones activas
            </p>
          </CardContent>
        </Card>

        {/* Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recientes (últimos 7 días)</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {recentSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">Nuevas suscripciones</p>
          </CardContent>
        </Card>

        {/* Por tipo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Por tipo</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">General</span>
              <span className="font-bold text-blue-600">{generalSubscriptions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Carreras</span>
              <span className="font-bold text-green-600">{careerSubscriptions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Blog</span>
              <span className="font-bold text-purple-600">{blogSubscriptions}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Suscripciones</CardTitle>
          <CardDescription>
            Todas las suscripciones registradas en el sistema
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
              columns={columns}
              data={subscriptions}
              currentPage={currentPage}
              pageCount={totalPages}
              onPageChange={setCurrentPage}
              searchKey="email"
              searchPlaceholder="Buscar por email..."
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editSubscription ? "Editar suscripción" : "Nueva suscripción"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de suscripción *</Label>
              <Select
                value={form.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="career">Carreras</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Procesando..."
                  : editSubscription
                  ? "Guardar cambios"
                  : "Crear suscripción"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
