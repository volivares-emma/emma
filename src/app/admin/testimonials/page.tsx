"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/loading/skeleton-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Star,
  Building,
  User,
  Quote,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MessageSquareHeart,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import type {
  Testimonial,
  TestimonialCreatePayload,
  TestimonialUpdatePayload,
} from "@/types/testimonial";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(
    null
  );
  const [form, setForm] = useState<TestimonialCreatePayload>({
    name: "",
    content: "",
    position: "",
    company: "",
    rating: 5,
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Estadísticas (calculadas en el servidor, aquí usamos valores de la página actual)
  const totalTestimonials = totalItems;
  const featuredTestimonials = testimonials.filter((t) => t.isFeatured).length;
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : "0";

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/testimonials?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestimonials(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar testimonios", {
        description: "No se pudieron cargar los testimonios.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (testimonial?: Testimonial) => {
    setEditTestimonial(testimonial || null);
    setForm(
      testimonial
        ? {
            name: testimonial.name,
            content: testimonial.content,
            position: testimonial.position || undefined,
            company: testimonial.company || null,
            rating: testimonial.rating,
            isFeatured: testimonial.isFeatured,
          }
        : {
            name: "",
            content: "",
            position: "",
            company: "",
            rating: 5,
            isFeatured: false,
          }
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditTestimonial(null);
    setForm({
      name: "",
      content: "",
      position: "",
      company: "",
      rating: 5,
      isFeatured: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editTestimonial ? "PUT" : "POST";
      const url = editTestimonial
        ? `/api/testimonials/${editTestimonial.id}`
        : "/api/testimonials";
      const payload = editTestimonial
        ? { ...form, id: editTestimonial.id }
        : form;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          editTestimonial ? "Testimonio actualizado" : "Testimonio creado",
          {
            description: editTestimonial
              ? "El testimonio se actualizó correctamente."
              : "El nuevo testimonio se creó correctamente.",
          }
        );
        fetchTestimonials();
        closeDialog();
      } else {
        toast.error("Error al procesar solicitud", {
          description: "No se pudo completar la operación.",
        });
      }
    } catch (error) {
      toast.error("Error al procesar solicitud", {
        description: "Ocurrió un error de conexión.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el testimonio de "${testimonial.name}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Testimonio eliminado", {
          description: "El testimonio se eliminó correctamente.",
        });
        if (testimonials.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchTestimonials();
        }
      } else {
        toast.error("Error al eliminar testimonio", {
          description: "No se pudo eliminar el testimonio.",
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor.",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="grid gap-4 md:grid-cols-4">
  //         {[...Array(4)].map((_, i) => (
  //           <Card key={i}>
  //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //               <div className="h-4 w-20 bg-muted animate-pulse rounded" />
  //               <div className="h-4 w-4 bg-muted animate-pulse rounded" />
  //             </CardHeader>
  //             <CardContent>
  //               <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
  //               <div className="h-3 w-24 bg-muted animate-pulse rounded" />
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //         {[...Array(3)].map((_, i) => (
  //           <Card key={i} className="h-64">
  //             <CardContent className="p-4">
  //               <div className="space-y-3">
  //                 <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
  //                 <div className="h-3 w-full bg-muted animate-pulse rounded" />
  //                 <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
  //               </div>
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonios</h1>
          <p className="text-muted-foreground">
            Gestiona los testimonios y reseñas de clientes
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Estadísticas - Resumen General */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Testimonios
            </CardTitle>
            <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestimonials}</div>
            <p className="text-xs text-muted-foreground">
              testimonios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredTestimonials}</div>
            <p className="text-xs text-muted-foreground">
              testimonios destacados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">de 5 estrellas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Página Actual</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage}</div>
            <p className="text-xs text-muted-foreground">
              de {totalPages} páginas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="relative">
        {loading && <Skeleton image lines={2} withButton />}
        {!loading && testimonials.length === 0 ? (
          <Card className="p-12 shadow-xl bg-white/80">
            <div className="text-center">
              <MessageSquareHeart className="h-16 w-16 text-blue-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-blue-700">
                No hay testimonios registrados
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer testimonio para comenzar.
              </p>
              <Button
                onClick={() => openDialog()}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Crear primer testimonio
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="relative h-72 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage />
                      <AvatarFallback>
                        {testimonial.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {testimonial.name}
                      </p>
                      {testimonial.position && (
                        <p className="text-xs text-muted-foreground truncate">
                          {testimonial.position}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                    {testimonial.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        Destacado
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <Quote className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {testimonial.content}
                    </p>
                    {testimonial.company && (
                      <div className="flex items-center text-xs text-muted-foreground pt-2">
                        <Building className="h-3 w-3 mr-1" />
                        <span className="truncate">{testimonial.company}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Acciones */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                    onClick={() => openDialog(testimonial)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => handleDelete(testimonial)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Placeholders para mantener la grilla cuando hay menos de 10 elementos */}
        {testimonials.length < itemsPerPage &&
          Array.from({ length: itemsPerPage - testimonials.length }).map(
            (_, index) => <div key={`placeholder-${index}`} className="h-72" />
          )}
      </div>

      {/* Paginación */}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="w-10"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTestimonial ? "Editar Testimonio" : "Nuevo Testimonio"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Posición</Label>
                <Input
                  id="position"
                  value={form.position ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={form.company ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rating">Calificación</Label>
                <Select
                  value={(form.rating || 5).toString()}
                  onValueChange={(value) =>
                    setForm({ ...form, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} estrella{rating > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="isFeatured" className="text-sm">
                  Destacado
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : editTestimonial
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
