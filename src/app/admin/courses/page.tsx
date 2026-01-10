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
import { BookOpen, Users, Clock, Award } from "lucide-react";
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
import { DataTable } from "@/components/admin/data-table";
import { createCoursesColumns } from "./components/courses-columns";
import type { Course, CreateCourseDto } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CreateCourseDto>({
    title: "",
    description: "",
    content: "",
    duration_hours: 0,
    instructor: "",
    category: "",
    meeting_link: "",
    max_students: 0,
    status: "draft",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Estadísticas
  const totalCourses = totalItems;
  const publishedCourses = courses.filter((course) => course.status === "published").length;
  const draftCourses = courses.filter((course) => course.status === "draft").length;
  const activeCourses = courses.filter((course) => course.is_active).length;

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/courses?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (course?: Course) => {
    setEditCourse(course || null);
    setForm(
      course
        ? {
            title: course.title,
            description: course.description || "",
            content: course.content || "",
            duration_hours: course.duration_hours || 0,
            instructor: course.instructor || "",
            category: course.category || "",
            meeting_link: course.meeting_link || "",
            max_students: course.max_students || 0,
            status: course.status,
          }
        : {
            title: "",
            description: "",
            content: "",
            duration_hours: 0,
            instructor: "",
            category: "",
            meeting_link: "",
            max_students: 0,
            status: "draft",
          }
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditCourse(null);
    setForm({
      title: "",
      description: "",
      content: "",
      duration_hours: 0,
      instructor: "",
      category: "",
      meeting_link: "",
      max_students: 0,
      status: "draft",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editCourse ? "PUT" : "POST";
      const url = editCourse ? `/api/courses/${editCourse.id}` : "/api/courses";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error en la operación");
      }

      toast.success(editCourse ? "Curso actualizado" : "Curso creado", {
        description: editCourse
          ? "El curso se actualizó correctamente."
          : "El curso se creó correctamente.",
      });

      fetchCourses();
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

  const handleDelete = async (course: Course) => {
    if (!confirm(`¿Eliminar curso "${course.title}"?`)) return;

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Curso eliminado correctamente");
        
        if (courses.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchCourses();
        }
      } else {
        toast.error("Error al eliminar curso");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const columns = createCoursesColumns({
    onEdit: openDialog,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gestiona los cursos y capacitaciones del sistema EMMA
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <BookOpen className="mr-2 h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              cursos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Publicados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCourses}</div>
            <p className="text-xs text-muted-foreground">
              disponibles para estudiantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Borrador
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCourses}</div>
            <p className="text-xs text-muted-foreground">
              en desarrollo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activos
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              cursos activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de datos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
          <CardDescription>
            Gestiona todos los cursos del sistema EMMA
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
              data={courses}
              searchKey="title"
              searchPlaceholder="Buscar cursos..."
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Información básica
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Nombre del curso"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Breve descripción del curso"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={form.instructor}
                  onChange={(e) =>
                    setForm({ ...form, instructor: e.target.value })
                  }
                  placeholder="Nombre del instructor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="Ej: Tecnología, Ventas"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration_hours">Duración (horas)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    value={form.duration_hours}
                    onChange={(e) =>
                      setForm({ ...form, duration_hours: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="text-sm font-medium text-muted-foreground">
                Configuración
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="meeting_link">Link de reunión</Label>
                <Input
                  id="meeting_link"
                  type="url"
                  value={form.meeting_link}
                  onChange={(e) =>
                    setForm({ ...form, meeting_link: e.target.value })
                  }
                  placeholder="https://meet.google.com/xxx-xxx-xxx"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max_students">Máximo estudiantes</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={form.max_students}
                    onChange={(e) =>
                      setForm({ ...form, max_students: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0 = ilimitado"
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: any) => setForm({ ...form, status: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenido del curso</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Describe el contenido detallado del curso"
                  rows={4}
                />
              </div>
            </fieldset>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Procesando..."
                  : editCourse
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