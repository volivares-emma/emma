"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Users, Shield, Clock } from "lucide-react";
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
import { createUserColumns } from "./components/users-columns";
import type { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserCreatePayload>({
    username: "",
    password: "",
    role: "guest",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Estadísticas (calculadas del total, no solo de la página actual)
  const totalUsers = totalItems;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const recentUsers = users.filter((user) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(user.created_at) > oneWeekAgo;
  }).length;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchFiles = async (userId: number) => {
    try {
      const related_type = "user";
      const response = await fetch(
        `/api/files?related_type=${related_type}&related_id=${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const plainUsers: User[] = data.data || [];

      // Trae los archivos en paralelo para cada usuario
      const usersWithFiles = await Promise.all(
        plainUsers.map(async (u) => {
          const files = await fetchFiles(u.id);
          return { ...u, files };
        })
      );

      setUsers(usersWithFiles);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (userId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("related_type", "user");
      formData.append("related_id", userId.toString());

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al subir archivo");
    } catch (error) {
      console.error("uploadFile error:", error);
      toast.error("No se pudo subir la imagen de perfil");
    }
  };

  const openDialog = (user?: User) => {
    setEditUser(user || null);
    setForm(
      user
        ? { username: user.username, password: "", role: user.role }
        : { username: "", password: "", role: "guest" }
    );

    if (
      user &&
      Array.isArray(user.files) &&
      user.files.length > 0 &&
      user.files[0].path
    ) {
      setPreview(user.files[0].path);
    } else {
      setPreview(null);
    }

    setFile(null); // reset file al abrir
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditUser(null);
    setForm({ username: "", password: "", role: "guest" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editUser ? "PUT" : "POST";
      const url = editUser ? `/api/users/${editUser.id}` : "/api/users";

      // payload en JSON (sin archivos)
      const payload = {
        username: form.username,
        password: form.password || undefined,
        role: form.role ?? "user",
      };

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en la operación");

      const savedUser: User = await res.json();

      // Si hay archivo -> subir a /api/files
      if (file) {
        await uploadFile(savedUser.id, file);
      }

      toast.success(editUser ? "Usuario actualizado" : "Usuario creado", {
        description: editUser
          ? "El usuario se actualizó correctamente."
          : "El usuario se creó correctamente.",
      });

      fetchUsers();
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error("Error en la operación", {
        description: "No se pudo completar la operación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`¿Eliminar usuario "${user.username}"?`)) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Usuario eliminado");

        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers();
        }
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const columns = createUserColumns({
    onEdit: openDialog,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios y sus permisos del sistema
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              con permisos de admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Regulares
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers - adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              sin permisos de admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos (7 días)
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentUsers}</div>
            <p className="text-xs text-muted-foreground">
              registrados recientemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de datos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestiona todos los usuarios del sistema
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
              data={users}
              searchKey="username"
              searchPlaceholder="Buscar usuarios..."
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Datos básicos
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  placeholder="Escribe un nombre de usuario"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">
                  Contraseña {editUser && "(vacío = mantener actual)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••"
                  required={!editUser}
                />
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Configuración
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: "admin" | "editor" | "guest" | "reader") => setForm({ ...form, role: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reader">Lector</SelectItem>
                    <SelectItem value="guest">Invitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">Imagen de perfil</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    if (f) setPreview(URL.createObjectURL(f));
                  }}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-16 w-16 rounded-full mt-2 object-cover"
                  />
                )}
              </div>
            </fieldset>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Procesando..."
                  : editUser
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
