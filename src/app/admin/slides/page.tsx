"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/loading/skeleton-admin";
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
import { SlideCard } from "./components/slide-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Monitor,
  BarChart3,
  Users,
  Lightbulb,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  FileSliders,
} from "lucide-react";
import { toast } from "sonner";
import type { Slide, SlideCreatePayload } from "@/types/slide";

const visualTypeConfig = {
  dashboard: {
    label: "Dashboard",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Monitor,
  },
  analytics: {
    label: "Analytics",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: BarChart3,
  },
  team: {
    label: "Team",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Users,
  },
  growth: {
    label: "Growth",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: TrendingUp,
  },
  innovation: {
    label: "Innovation",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Lightbulb,
  },
};

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlide, setEditSlide] = useState<Slide | null>(null);
  const [form, setForm] = useState<SlideCreatePayload>({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    visualType: "dashboard",
    isActive: true,
    sortOrder: 0,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Estadísticas
  const totalSlides = slides.length;
  const activeSlides = slides.filter((s) => s.isActive).length;
  const inactiveSlides = slides.filter((s) => !s.isActive).length;

  useEffect(() => {
    fetchSlides();
  }, []);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Trae los archivos asociados a cada slide
  const fetchFiles = async (slideId: number) => {
    try {
      const related_type = "slide";
      const response = await fetch(
        `/api/files?related_type=${related_type}&related_id=${slideId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/slides", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      console.log(data);
      const plainSlides: Slide[] = data.data || data.slides || [];
      // Trae los archivos en paralelo para cada slide
      const slidesWithFiles = await Promise.all(
        plainSlides.map(async (s) => {
          const files = await fetchFiles(s.id);
          return { ...s, files };
        })
      );
      // Ordenar por sortOrder
      const sortedSlides = slidesWithFiles.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setSlides(sortedSlides);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar slides", {
        description: "No se pudieron cargar los slides.",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (slideId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("related_type", "slide");
      formData.append("related_id", slideId.toString());

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

  const openDialog = (slide?: Slide) => {
    setEditSlide(slide || null);
    setForm(
      slide
        ? {
            title: slide.title || "",
            subtitle: slide.subtitle || "",
            description: slide.description || "",
            buttonText: slide.buttonText || "",
            buttonLink: slide.buttonLink || "",
            visualType: slide.visualType,
            isActive: slide.isActive,
            sortOrder: slide.sortOrder,
          }
        : {
            title: "",
            subtitle: "",
            description: "",
            buttonText: "",
            buttonLink: "",
            visualType: "dashboard",
            isActive: true,
            sortOrder: slides.length + 1,
          }
    );
    // Reset file and preview state
    setFile(null);
    setPreview(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditSlide(null);
    setForm({
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      visualType: "dashboard",
      isActive: true,
      sortOrder: 0,
    });
    // Reset file and preview state and cleanup URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setForm({ ...form, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editSlide ? "PUT" : "POST";
      const url = editSlide ? `/api/slides/${editSlide.id}` : "/api/slides";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error en la operación");

      const savedSlide: Slide = await res.json();

      if (file) {
        await uploadFile(savedSlide.id, file);
      }

      toast.success(editSlide ? "Slide actualizado" : "Slide creado", {
        description: editSlide
          ? "El slide se actualizó correctamente."
          : "El nuevo slide se creó correctamente.",
      });

      fetchSlides();
      closeDialog();
      // Reset file state after successful save
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en la operación", {
        description: "No se pudo completar la operación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slide: Slide) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el slide "${slide.title}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      toast.success("Slide eliminado", {
        description: "El slide se eliminó correctamente.",
      });

      fetchSlides();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar el slide.",
      });
    }
  };

  const toggleSlideStatus = async (slide: Slide) => {
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !slide.isActive }),
      });

      if (!res.ok) {
        throw new Error("Error al cambiar estado");
      }

      toast.success(slide.isActive ? "Slide desactivado" : "Slide activado", {
        description: `El slide se ${
          slide.isActive ? "desactivó" : "activó"
        } correctamente.`,
      });

      fetchSlides();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cambiar estado", {
        description: "No se pudo cambiar el estado del slide.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slides</h1>
          <p className="text-muted-foreground">
            Gestiona los slides de tu sitio web
          </p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="sm:ml-4 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Slide
        </Button>
      </div>

      {/* Slides - Resumen General */}
      <div className="grid gap-4 sm:grid-cols-3 flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Total Slides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-blue-900">
              {totalSlides}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-green-900">
              {activeSlides}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Inactivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-900">
              {inactiveSlides}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de slides */}
      <div className="relative">
        {loading && <Skeleton image lines={2} withButton />}
        {!loading && slides.length === 0 && (
          <Card className="p-12 shadow-xl bg-white/80 col-span-full">
            <div className="text-center">
              <FileSliders className="h-16 w-16 text-blue-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-blue-700">
                No hay slides registrados
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer slide para comenzar.
              </p>
              <Button
                onClick={() => openDialog()}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Crear primer slide
              </Button>
            </div>
          </Card>
        )}
        {!loading && slides.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {slides.map((slide) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                onEdit={openDialog}
                onToggleStatus={toggleSlideStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editSlide ? "Editar slide" : "Nuevo slide"}
            </DialogTitle>
            <DialogDescription>
              {editSlide
                ? "Modifica los campos del slide y guarda los cambios."
                : "Completa el formulario para crear un nuevo slide."}
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
                  placeholder="Título del slide"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Subtítulo del slide"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción del slide"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Imagen de fondo *</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                key={dialogOpen ? 'file-input' : 'file-input-reset'} // Force re-render to clear input
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  } else {
                    setFile(null);
                    setPreview(null);
                  }
                }}
              />
              {preview && (
                <div className="mt-2">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={160}
                    height={90}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                </div>
              )}
              {editSlide && editSlide.files && editSlide.files.length > 0 && !preview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                  <Image
                    src={editSlide.files[0].path}
                    alt="Imagen actual"
                    width={160}
                    height={90}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  placeholder="Más información"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Enlace del botón</Label>
                <Input
                  id="buttonLink"
                  name="buttonLink"
                  type="url"
                  value={form.buttonLink}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visualType">Tipo visual</Label>
                <Select
                  value={form.visualType}
                  onValueChange={(value) =>
                    handleSelectChange("visualType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(visualTypeConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Orden *</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="1"
                  max="10"
                  value={form.sortOrder}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Estado</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    {form.isActive ? "Activo" : "Inactivo"}
                  </Label>
                </div>
              </div>
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
                  : editSlide
                  ? "Guardar cambios"
                  : "Crear slide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
