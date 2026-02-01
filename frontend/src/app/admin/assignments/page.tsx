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
import { UserCheck, BookOpen, Clock, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/admin/data-table";
import { createAssignmentsColumns } from "./components/assignments-columns";
import { createAssignmentGroupsColumns } from "./components/assignment-groups-columns";
import { UpdateProgressDialog } from "./components/update-progress-dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CourseAssignment, Course, CourseAssignmentGroup } from "@/types/course";
import type { User } from "@/types/user";

interface AssignmentForm {
  name: string;
  course_id: number | "";
  user_ids: number[];
  due_date: string;
  notes: string;
  status: "pending" | "in_progress" | "completed" | "expired";
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentGroups, setAssignmentGroups] = useState<CourseAssignmentGroup[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [editGroup, setEditGroup] = useState<CourseAssignmentGroup | null>(null);
  const [form, setForm] = useState<AssignmentForm>({
    name: "",
    course_id: "",
    user_ids: [],
    due_date: "",
    notes: "",
    status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [groupPage, setGroupPage] = useState(1);
  const [groupTotalItems, setGroupTotalItems] = useState(0);
  const [groupTotalPages, setGroupTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Estadísticas
  const totalAssignments = totalItems;
  const completedAssignments = assignments.filter((a) => a.status === "completed").length;
  const inProgressAssignments = assignments.filter((a) => a.status === "in_progress").length;
  const pendingAssignments = assignments.filter((a) => a.status === "pending").length;

  useEffect(() => {
    fetchAssignments();
    fetchAssignmentGroups();
    fetchCourses();
    fetchUsers();
  }, [currentPage, groupPage]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/assignments?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignments(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar las asignaciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentGroups = async () => {
    setGroupsLoading(true);
    try {
      const response = await fetch(
        `/api/assignment-groups?page=${groupPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignmentGroups(data.data || []);
      setGroupTotalItems(data.total || 0);
      setGroupTotalPages(
        Math.ceil((data.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar las asignaciones generales");
    } finally {
      setGroupsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses?pageSize=100`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?pageSize=100`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openDialog = () => {
    setEditGroup(null);
    setForm({
      name: "",
      course_id: "",
      user_ids: [],
      due_date: "",
      notes: "",
      status: "pending",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (group: CourseAssignmentGroup) => {
    setEditGroup(group);
    setForm({
      name: group.name || "",
      course_id: group.course_id,
      user_ids: group.assignments?.map((a) => a.user_id) || [],
      due_date: group.due_date
        ? new Date(group.due_date).toISOString().slice(0, 16)
        : "",
      notes: group.notes || "",
      status: group.status || "pending",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditGroup(null);
    setForm({
      name: "",
      course_id: "",
      user_ids: [],
      due_date: "",
      notes: "",
      status: "pending",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!form.course_id || form.user_ids.length === 0) {
        toast.error("Selecciona un curso y al menos un usuario");
        return;
      }

      if (!form.name.trim()) {
        toast.error("Ingresa un nombre para la asignación");
        return;
      }

      if (editGroup) {
        const currentUserIds = editGroup.assignments?.map((a) => a.user_id) || [];
        const nextUserIds = form.user_ids;
        const addedUserIds = nextUserIds.filter((id) => !currentUserIds.includes(id));
        const removedUserIds = currentUserIds.filter((id) => !nextUserIds.includes(id));

        const updatePayload = {
          name: form.name.trim(),
          due_date: form.due_date || null,
          notes: form.notes || null,
          status: form.status,
        };

        const updateRes = await fetch(
          `/api/assignment-groups/${editGroup.id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          },
        );

        if (!updateRes.ok) {
          const errorData = await updateRes.json();
          throw new Error(errorData.error || "Error en la operación");
        }

        if (addedUserIds.length > 0) {
          const addRes = await fetch(
            `/api/assignment-groups/${editGroup.id}/users`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_ids: addedUserIds }),
            },
          );

          if (!addRes.ok) {
            const errorData = await addRes.json();
            throw new Error(errorData.error || "Error en la operación");
          }
        }

        if (removedUserIds.length > 0) {
          for (const userId of removedUserIds) {
            const removeRes = await fetch(
              `/api/assignment-groups/${editGroup.id}/users/${userId}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            );

            if (!removeRes.ok) {
              const errorData = await removeRes.json();
              throw new Error(errorData.error || "Error en la operación");
            }
          }
        }

        toast.success("Asignación actualizada correctamente");
      } else {
        const payload = {
          name: form.name.trim(),
          course_id: form.course_id,
          user_ids: form.user_ids,
          due_date: form.due_date || null,
          notes: form.notes || null,
          status: form.status,
        };

        const res = await fetch(`/api/assignment-groups`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error en la operación");
        }

        toast.success("Asignación creada correctamente");
      }
      fetchAssignmentGroups();
      fetchAssignments();
      closeDialog();
    } catch (error: any) {
      console.error(error);
      toast.error("Error en la operación", {
        description: error.message || "No se pudo completar la operación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserSelection = (userIds: number[]) => {
    setForm(prev => ({
      ...prev,
      user_ids: userIds
    }));
  };

  // Convertir usuarios a opciones para el MultiSelect
  const getUserOptions = () => {
    return users
      .filter(user => user.is_active)
      .map(user => ({
        id: user.id,
        label: `${user.first_name || ''} ${user.last_name || ''} (${user.username})`.trim(),
        subtitle: `Rol: ${user.role}`,
        data: user
      }));
  };

  const openProgressDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setProgressDialogOpen(true);
  };

  const handleDeleteGroup = async (group: CourseAssignmentGroup) => {
    if (!confirm(`¿Eliminar la asignación "${group.name}"?`)) return;

    try {
      const response = await fetch(`/api/assignment-groups/${group.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar asignación");
      }

      toast.success("Asignación eliminada correctamente");
      if (assignmentGroups.length === 1 && groupPage > 1) {
        setGroupPage(groupPage - 1);
      } else {
        fetchAssignmentGroups();
      }
    } catch (error: any) {
      toast.error("Error al eliminar asignación", {
        description: error.message || "No se pudo eliminar la asignación.",
      });
    }
  };

  const handleUpdateProgress = async (data: any) => {
    try {
      const response = await fetch(`/api/progress/${data.assignmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress_percentage: data.progress_percentage,
          notes: data.notes,
        }),
      });

      if (response.ok) {
        toast.success("Progreso actualizado correctamente");
        fetchAssignments();
      } else {
        throw new Error("Error al actualizar progreso");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Error al actualizar progreso");
    }
  };

  const columns = createAssignmentsColumns({
    onUpdateProgress: openProgressDialog,
  });

  const groupColumns = createAssignmentGroupsColumns({
    onEdit: openEditDialog,
    onDelete: handleDeleteGroup,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asignaciones</h1>
          <p className="text-muted-foreground">
            Asigna cursos a usuarios y gestiona su progreso
          </p>
        </div>
        <Button onClick={openDialog}>
          <UserCheck className="mr-2 h-4 w-4" />
          Nueva Asignación
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asignaciones
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              asignaciones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completadas
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments}</div>
            <p className="text-xs text-muted-foreground">
              cursos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Progreso
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressAssignments}</div>
            <p className="text-xs text-muted-foreground">
              en progreso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              por iniciar
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Asignaciones generales</TabsTrigger>
          <TabsTrigger value="users">Asignaciones por usuario</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones generales</CardTitle>
              <CardDescription>
                Gestiona grupos de asignaciones y sus usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupsLoading ? (
                <div className="grid gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <DataTable
                  columns={groupColumns}
                  data={assignmentGroups}
                  searchKey="name"
                  searchPlaceholder="Buscar asignaciones..."
                  pageCount={groupTotalPages}
                  currentPage={groupPage}
                  onPageChange={setGroupPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones por usuario</CardTitle>
              <CardDescription>
                Gestiona el progreso de cada estudiante
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
                  data={assignments}
                  searchKey="user"
                  searchPlaceholder="Buscar asignaciones..."
                  pageCount={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para crear asignación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-200 lg:max-w-250 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Asignación</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Selección de curso
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="assignment_name">Nombre de la asignación *</Label>
                <Input
                  id="assignment_name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Ej: Capacitación Ventas - Febrero"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="course">Curso *</Label>
                <Select
                  value={form.course_id.toString()}
                  onValueChange={(value) => setForm({ ...form, course_id: parseInt(value) })}
                  disabled={!!editGroup}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.filter(c => c.is_active).map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title} - {course.category || "Sin categoría"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <MultiSelect
                label="Selección de usuarios"
                options={getUserOptions()}
                selectedIds={form.user_ids}
                onSelectionChange={handleUserSelection}
                placeholder="Buscar y seleccionar usuarios..."
                searchPlaceholder="Buscar por nombre o username..."
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Seleccionados: {form.user_ids.length} usuarios
              </p>
              {editGroup && (
                <p className="text-xs text-muted-foreground">
                  Al editar, se mantienen los usuarios actuales y puedes agregar o quitar usuarios.
                </p>
              )}
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Configuración adicional
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="due_date">Fecha límite (opcional)</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      status: value as AssignmentForm["status"],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Instrucciones especiales o comentarios"
                  rows={3}
                />
              </div>
            </fieldset>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Procesando..." : "Crear Asignaciones"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para actualizar progreso */}
      <UpdateProgressDialog
        assignment={selectedAssignment}
        open={progressDialogOpen}
        onClose={() => {
          setProgressDialogOpen(false);
          setSelectedAssignment(null);
        }}
        onUpdate={handleUpdateProgress}
      />
    </div>
  );
}