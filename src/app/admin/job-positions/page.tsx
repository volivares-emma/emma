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
import { Badge } from "@/components/ui/badge";
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
import Skeleton from "@/components/loading/skeleton-admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building,
  Calendar,
  Target,
  List,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type {
  JobPosition,
  JobPositionListResponse,
  JobPositionCreatePayload,
  JobPositionUpdatePayload,
} from "@/types/job-positions";

// Configuración de tipos de empleo
const employmentTypes = {
  "full-time": {
    label: "Tiempo completo",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  "part-time": {
    label: "Medio tiempo",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  contract: {
    label: "Contrato",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  freelance: {
    label: "Freelance",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  internship: {
    label: "Pasantía",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

export default function JobPositionsPage() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPosition, setEditPosition] = useState<JobPosition | null>(null);
  const [form, setForm] = useState<
    JobPositionCreatePayload | JobPositionUpdatePayload
  >({
    title: "",
    description: "",
    department: "",
    location: "",
    employmentType: "",
    salaryMin: undefined,
    salaryMax: undefined,
    requirements: [],
    responsibilities: [],
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  // Estadísticas calculadas
  const totalPositions = jobPositions.length;
  const activePositions = jobPositions.filter((p) => p.isActive).length;
  const featuredPositions = jobPositions.filter((p) => p.isFeatured).length;
  const inactivePositions = jobPositions.filter((p) => !p.isActive).length;

  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/job-positions");
      const data: JobPositionListResponse = await response.json();

      setJobPositions(data.data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar posiciones", {
        description: "No se pudieron cargar las posiciones de trabajo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (position?: JobPosition) => {
    setEditPosition(position || null);
    if (position) {
      setForm({
        id: position.id,
        title: position.title || "",
        description: position.description || "",
        department: position.department || "",
        location: position.location || "",
        employmentType: position.employmentType || "",
        salaryMin: position.salaryMin === null ? undefined : position.salaryMin,
        salaryMax: position.salaryMax === null ? undefined : position.salaryMax,
        requirements: Array.isArray(position.requirements)
          ? position.requirements
          : [],
        responsibilities: Array.isArray(position.responsibilities)
          ? position.responsibilities
          : [],
        experienceMin: position.experienceMin,
        isActive: position.isActive,
        isFeatured: position.isFeatured,
      } as JobPositionUpdatePayload);
    } else {
      setForm({
        title: "",
        description: "",
        department: "",
        location: "",
        employmentType: "",
        salaryMin: undefined,
        salaryMax: undefined,
        requirements: [],
        responsibilities: [],
      } as JobPositionCreatePayload);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditPosition(null);
    setForm({
      title: "",
      description: "",
      department: "",
      location: "",
      employmentType: "",
      salaryMin: undefined,
      salaryMax: undefined,
      requirements: [],
      responsibilities: [],
    });
    setNewRequirement("");
    setNewResponsibility("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "salaryMin" || name === "salaryMax"
          ? value === ""
            ? undefined
            : parseInt(value)
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setForm((prev) => ({
        ...prev,
        requirements: Array.isArray(prev.requirements)
          ? [...prev.requirements, newRequirement.trim()]
          : [newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      requirements: Array.isArray(prev.requirements)
        ? prev.requirements.filter((_, i) => i !== index)
        : [],
    }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setForm((prev) => ({
        ...prev,
        responsibilities: Array.isArray(prev.responsibilities)
          ? [...prev.responsibilities, newResponsibility.trim()]
          : [newResponsibility.trim()],
      }));
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: Array.isArray(prev.responsibilities)
        ? prev.responsibilities.filter((_, i) => i !== index)
        : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "/api/job-positions";
      let method = "POST";
      let payload: JobPositionCreatePayload | JobPositionUpdatePayload = form;
      if (editPosition) {
        url = `/api/job-positions/${editPosition.id}`;
        method = "PUT";
        payload = {
          id: editPosition.id,
          title: form.title,
          description: form.description,
          department: form.department,
          location: form.location,
          employmentType: form.employmentType,
          salaryMin: form.salaryMin,
          salaryMax: form.salaryMax,
          requirements: Array.isArray(form.requirements)
            ? form.requirements
            : [],
          responsibilities: Array.isArray(form.responsibilities)
            ? form.responsibilities
            : [],
          experienceMin: form.experienceMin,
        };
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          editPosition ? "Posición actualizada" : "Posición creada",
          {
            description: editPosition
              ? "La posición se actualizó correctamente."
              : "La nueva posición se creó correctamente.",
          }
        );
        closeDialog();
        fetchJobPositions();
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      toast.error("Error al guardar", {
        description: "No se pudo guardar la posición.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (position: JobPosition) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta posición?")) {
      return;
    }

    try {
      const response = await fetch(`/api/job-positions/${position.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Posición eliminada", {
          description: "La posición se eliminó correctamente.",
        });
        fetchJobPositions();
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (error) {
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar la posición.",
      });
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salario no especificado";
    if (min && max)
      return `S/ ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde S/ ${min.toLocaleString()}`;
    if (max) return `Hasta S/ ${max.toLocaleString()}`;
    return "";
  };

  // Separar posiciones activas e inactivas
  const activeJobPositions = jobPositions.filter((p) => p.isActive);
  const inactiveJobPositions = jobPositions.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Posiciones de Trabajo
          </h1>
          <p className="text-muted-foreground">
            Gestiona las ofertas laborales y vacantes
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva posición
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalPositions}
            </div>
            <p className="text-xs text-muted-foreground">
              Posiciones registradas
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
              {activePositions}
            </div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacadas</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {featuredPositions}
            </div>
            <p className="text-xs text-muted-foreground">Premium</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <EyeOff className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {inactivePositions}
            </div>
            <p className="text-xs text-muted-foreground">Cerradas</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        {loading && <Skeleton image lines={2} withButton />}
        {!loading && jobPositions.length === 0 ? (
          <Card className="p-12 shadow-xl bg-white/80">
            <div className="text-center">
              <List className="h-16 w-16 text-blue-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-blue-700">
                No hay posiciones registradas
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera posición para comenzar.
              </p>
              <Button
                onClick={() => openDialog()}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Crear primera posición
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {activeJobPositions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-600">
                    Posiciones Activas ({activeJobPositions.length})
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeJobPositions.map((position) => (
                    <Card
                      key={position.id}
                      className="group hover:shadow-lg transition-all duration-300 border-green-200 bg-linear-to-br from-white to-green-50"
                    >
                      <CardHeader className="relative pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg font-semibold group-hover:text-green-700 transition-colors line-clamp-1">
                                {position.title}
                              </CardTitle>
                              {position.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  <Star className="h-3 w-3 mr-1" />
                                  Destacada
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {position.department && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {position.department}
                                </div>
                              )}
                              {position.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {position.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openDialog(position)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(position)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {position.description && (
                          <CardDescription className="line-clamp-2">
                            {position.description}
                          </CardDescription>
                        )}

                        <div className="space-y-3">
                          {position.employmentType && (
                            <Badge
                              className={
                                employmentTypes[
                                  position.employmentType as keyof typeof employmentTypes
                                ]?.color || "bg-gray-100 text-gray-800"
                              }
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {employmentTypes[
                                position.employmentType as keyof typeof employmentTypes
                              ]?.label || position.employmentType}
                            </Badge>
                          )}

                          <div className="flex items-center gap-1 text-sm font-medium text-green-700">
                            {formatSalary(
                              position.salaryMin === null
                                ? undefined
                                : position.salaryMin,
                              position.salaryMax === null
                                ? undefined
                                : position.salaryMax
                            )}
                          </div>

                          {position.experienceMin && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Target className="h-3 w-3" />
                              Mín. {position.experienceMin} años de experiencia
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                position.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activa
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Posiciones Inactivas */}
            {inactiveJobPositions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-600">
                    Posiciones Inactivas ({inactiveJobPositions.length})
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {inactiveJobPositions.map((position) => (
                    <Card
                      key={position.id}
                      className="group hover:shadow-md transition-all duration-300 border-gray-200 bg-linear-to-br from-white to-gray-50 opacity-75"
                    >
                      <CardHeader className="relative pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-700 line-clamp-1">
                              {position.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              {position.department && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {position.department}
                                </div>
                              )}
                              {position.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {position.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openDialog(position)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(position)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {position.description && (
                          <CardDescription className="line-clamp-2 text-gray-600">
                            {position.description}
                          </CardDescription>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(position.createdAt).toLocaleDateString()}
                          </div>
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactiva
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editPosition ? "Editar posición" : "Nueva posición"}
            </DialogTitle>
            <DialogDescription>
              {editPosition
                ? "Modifica los campos de la posición y guarda los cambios."
                : "Completa el formulario para crear una nueva posición de trabajo."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la posición *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Desarrollador Frontend"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Desarrollo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Remoto, Ciudad, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Tipo de empleo</Label>
                <Select
                  value={form.employmentType}
                  onValueChange={(value) =>
                    handleSelectChange("employmentType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(employmentTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMin">Salario mínimo</Label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  value={form.salaryMin || ""}
                  onChange={handleChange}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salario máximo</Label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  value={form.salaryMax || ""}
                  onChange={handleChange}
                  placeholder="80000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del puesto *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe las funciones principales, el perfil ideal y los beneficios..."
                rows={4}
                required
              />
            </div>

            {/* Requirements Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Requisitos
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Agregar nuevo requisito..."
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addRequirement())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addRequirement}
                    disabled={!newRequirement.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {Array.isArray(form.requirements) &&
                form.requirements.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {form.requirements.map((req, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {typeof req === "string" ? req : JSON.stringify(req)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-red-100"
                            onClick={() => removeRequirement(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Responsibilities Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Responsabilidades
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Agregar nueva responsabilidad..."
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addResponsibility())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addResponsibility}
                    disabled={!newResponsibility.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {Array.isArray(form.responsibilities) &&
                form.responsibilities.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {form.responsibilities.map((resp, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {typeof resp === "string"
                            ? resp
                            : JSON.stringify(resp)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-red-100"
                            onClick={() => removeResponsibility(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : editPosition
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
