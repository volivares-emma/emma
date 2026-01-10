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
import {
  UserPlus,
  Users,
  FileText,
  Clock,
  Eye,
  ExternalLink,
  Download,
  File,
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
import { DataTable } from "@/components/admin/data-table";
import { createRecruitmentColumns } from "./components/recruitment-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobPosition } from "@/types/job-positions";
import type {
  Recruitment,
  RecruitmentCreatePayload,
  RecruitmentUpdatePayload,
} from "@/types/recruitment";

export default function RecruitmentsPage() {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecruitment, setEditRecruitment] = useState<Recruitment | null>(
    null
  );
  const [form, setForm] = useState<
    RecruitmentCreatePayload | RecruitmentUpdatePayload
  >({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    salaryExpectation: "",
    coverLetter: "",
    status: "new",
    positionId: undefined,
  });
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Función helper para determinar el tipo de archivo
  const getFileType = (fileUrl: string) => {
    if (!fileUrl) return 'unknown';
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (extension === 'doc' || extension === 'docx') return 'word';
    return 'unknown';
  };

  // Función helper para obtener el nombre del archivo
  const getFileName = (fileUrl: string) => {
    if (!fileUrl) return 'archivo';
    return fileUrl.split('/').pop() || 'archivo';
  };

  // Estadísticas
  const totalRecruitments = totalItems;
  const recentRecruitments = recruitments.filter((r) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(r.createdAt) > oneWeekAgo;
  }).length;

  useEffect(() => {
    fetchRecruitments();
    fetchJobPositions();
  }, [currentPage]);

  const fetchFiles = async (recruitmentId: number) => {
    try {
      const related_type = "recruitment";
      const response = await fetch(
        `/api/files?related_type=${related_type}&related_id=${recruitmentId}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("fetchFiles error:", error);
      return [];
    }
  };

  const fetchRecruitments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/recruitments?page=${currentPage}&pageSize=${itemsPerPage}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const plainRecruitments: Recruitment[] = data.data || [];

      const withFiles = await Promise.all(
        plainRecruitments.map(async (r) => {
          const files = await fetchFiles(r.id);
          return { ...r, files };
        })
      );

      setRecruitments(withFiles);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("fetchRecruitments error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPositions = async () => {
    try {
      const response = await fetch("/api/job-positions?page=1&pageSize=100");
      if (!response.ok) throw new Error("Error al obtener posiciones");
      const data = await response.json();
      setJobPositions(data.data || []);
    } catch (error) {
      console.error("fetchJobPositions error:", error);
    }
  };

  const uploadFile = async (recruitmentId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("related_type", "recruitment");
      formData.append("related_id", recruitmentId.toString());

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al subir archivo");
    } catch (error) {
      console.error("uploadFile error:", error);
      toast.error("No se pudo subir el archivo del candidato");
    }
  };

  const openDialog = (recruitment?: Recruitment) => {
    setEditRecruitment(recruitment || null);
    if (recruitment) {
      setForm({
        name: recruitment.name,
        email: recruitment.email,
        phone: recruitment.phone ?? "",
        position: recruitment.position,
        experience: recruitment.experience ?? "",
        salaryExpectation: recruitment.salaryExpectation ?? "",
        coverLetter: recruitment.coverLetter ?? "",
        status: recruitment.status,
        positionId: recruitment.positionId ?? undefined,
      });
      if (recruitment.files?.length) {
        setPreview(recruitment.files[0].path);
      } else {
        setPreview(null);
      }
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        salaryExpectation: "",
        coverLetter: "",
        status: "new",
        positionId: undefined,
      });
      setPreview(null);
    }
    setFile(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditRecruitment(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      salaryExpectation: "",
      coverLetter: "",
      status: "new",
      positionId: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editRecruitment ? "PUT" : "POST";
      const url = editRecruitment
        ? `/api/recruitments/${editRecruitment.id}`
        : "/api/recruitments";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error en la operación");

      const savedRecruitment: Recruitment = await res.json();

      if (file) {
        await uploadFile(savedRecruitment.id, file);
      }

      toast.success(
        editRecruitment ? "Recruitment actualizado" : "Recruitment creado"
      );
      fetchRecruitments();
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error("Error en la operación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recruitment: Recruitment) => {
    if (!confirm(`¿Eliminar al candidato "${recruitment.name}"?`)) return;

    try {
      const res = await fetch(`/api/recruitments/${recruitment.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Recruitment eliminado");
        if (recruitments.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchRecruitments();
        }
      } else {
        toast.error("Error al eliminar recruitment");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const columns = createRecruitmentColumns({
    onEdit: openDialog,
    onDelete: handleDelete,
    onStatusChange: async (recruitment, newStatus) => {
      try {
        const allowedStatus = ["new", "reviewing", "interview", "hired", "rejected"];
        const statusValue = allowedStatus.includes(newStatus) ? (newStatus as RecruitmentUpdatePayload["status"]) : undefined;
        const payload: RecruitmentUpdatePayload = { status: statusValue };
        const response = await fetch(`/api/recruitments/${recruitment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          toast.success("Estado actualizado", {
            description: `El estado se cambió a ${newStatus}.`,
          });
          fetchRecruitments();
        } else {
          throw new Error("Error al actualizar estado");
        }
      } catch (error) {
        toast.error("Error al actualizar estado", {
          description: "No se pudo actualizar el estado del reclutamiento.",
        });
      }
    },
    onViewCV: (pdfUrl: string) => {
      setSelectedPdfUrl(pdfUrl);
      setPdfViewerOpen(true);
    },
    statusConfig: {
      new: { label: "Nuevo", color: "bg-blue-100 text-blue-800 border-blue-200", icon: FileText },
      reviewing: { label: "Revisando", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      interview: { label: "Entrevista", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Users },
      hired: { label: "Contratado", color: "bg-green-100 text-green-800 border-green-200", icon: Eye },
      rejected: { label: "Rechazado", color: "bg-red-100 text-red-800 border-red-200", icon: FileText },
    },
    getCvUrl: (recruitment: Recruitment) => {
      return recruitment.files?.[0]?.path;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitments</h1>
          <p className="text-muted-foreground">
            Gestiona los candidatos y sus postulaciones
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Recruitment
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Candidatos</CardTitle>
            <CardDescription>Registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecruitments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nuevos (7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRecruitments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Candidatos</CardTitle>
          <CardDescription>Gestiona todas las postulaciones</CardDescription>
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
              data={recruitments}
              searchKey="name"
              searchPlaceholder="Buscar candidatos..."
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editRecruitment ? "Editar Recruitment" : "Crear Recruitment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">
                  Posición aplicada * 
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  required
                  disabled={!!form.positionId}
                  className={form.positionId ? "bg-gray-100 cursor-not-allowed" : ""}
                  placeholder={form.positionId ? "Se actualiza automáticamente..." : "Nombre de la posición"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Años de experiencia</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  placeholder="5 años"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryExpectation">Expectativa salarial</Label>
                <Input
                  id="salaryExpectation"
                  name="salaryExpectation"
                  value={form.salaryExpectation}
                  onChange={(e) =>
                    setForm({ ...form, salaryExpectation: e.target.value })
                  }
                  placeholder="S/ 3,000 - S/ 5,000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionId">Posición relacionada</Label>
              <Select
                value={form.positionId?.toString() || "none"}
                onValueChange={(value) => {
                  const newPositionId = value === "none" ? undefined : parseInt(value);
                  const selectedPosition = jobPositions.find(jp => jp.id === newPositionId);
                  
                  setForm({
                    ...form,
                    positionId: newPositionId,
                    // Actualizar el campo position automáticamente si selecciona una posición específica
                    position: selectedPosition ? selectedPosition.title : form.position,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar posición..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin posición específica</SelectItem>
                  {jobPositions.map((position) => (
                    <SelectItem
                      key={position.id}
                      value={position.id.toString()}
                    >
                      {position.title} - {position.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {form.positionId 
                  ? "Posición vinculada: se actualizará automáticamente el campo 'Posición aplicada'" 
                  : "Sin vinculación: mantén el campo 'Posición aplicada' como texto libre"
                }
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvFile">CV (PDF/Word)</Label>
              <Input
                id="cvFile"
                name="cvFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  if (f) setPreview(f.name);
                }}
              />
              {editRecruitment && preview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSelectedPdfUrl(preview);
                    setPdfViewerOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" /> Ver CV actual
                </Button>
              )}
              {preview && !editRecruitment && (
                <p className="text-xs text-muted-foreground">
                  Archivo: {preview}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Carta de presentación</Label>
              <Input
                id="coverLetter"
                name="coverLetter"
                value={form.coverLetter}
                onChange={(e) =>
                  setForm({ ...form, coverLetter: e.target.value })
                }
                placeholder="Escriba aquí la carta de presentación..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Procesando..."
                  : editRecruitment
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Visor de CV
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            {selectedPdfUrl ? (
              <div className="w-full h-full">
                {getFileType(selectedPdfUrl) === 'pdf' ? (
                  // Visor para PDFs mejorado
                  <div className="flex flex-col h-full">
                    {/* Header del PDF */}
                    <div className="bg-white border-b border-gray-200 p-4">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#035AA6] to-[#07598C] rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#0D0D0D]">
                              {getFileName(selectedPdfUrl)}
                            </h3>
                            <p className="text-sm text-gray-500">Documento PDF</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedPdfUrl, "_blank")}
                            className="border-[#11B4D9]/30 text-[#035AA6] hover:bg-[#11B4D9]/10"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> 
                            Nueva pestaña
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = selectedPdfUrl;
                              link.download = getFileName(selectedPdfUrl);
                              link.click();
                            }}
                            className="border-[#038C7F]/30 text-[#038C7F] hover:bg-[#038C7F]/10"
                          >
                            <Download className="h-4 w-4 mr-2" /> 
                            Descargar
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visor PDF */}
                    <div className="flex-1 bg-gray-50 p-4">
                      <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <iframe
                          src={selectedPdfUrl}
                          className="w-full h-full border-0"
                          title="CV Viewer"
                        />
                      </div>
                    </div>
                    
                    {/* Footer con información adicional */}
                    <div className="bg-gray-50 border-t border-gray-200 p-3">
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#038C7F] rounded-full"></div>
                          <span>PDF cargado correctamente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#035AA6]" />
                          <span>Zoom disponible en el visor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : getFileType(selectedPdfUrl) === 'word' ? (
                  // Vista para documentos Word
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="text-center mb-8">
                      {/* Icono de Word grande con colores de la marca */}
                      <div className="w-32 h-32 bg-linear-to-br from-[#11B4D9] to-[#038C7F] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
                        <File className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0D0D0D] mb-2">
                        Documento de Word
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {getFileName(selectedPdfUrl)}
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Los documentos de Word no se pueden previsualizar en el navegador
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => window.open(selectedPdfUrl, "_blank")}
                        className="w-full bg-linear-to-r from-[#035AA6] to-[#11B4D9] hover:from-[#07598C] hover:to-[#038C7F]"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" /> 
                        Abrir en nueva pestaña
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = selectedPdfUrl;
                          link.download = getFileName(selectedPdfUrl);
                          link.click();
                        }}
                        className="w-full border-[#11B4D9]/30 text-[#035AA6] hover:bg-[#11B4D9]/10"
                      >
                        <Download className="h-5 w-5 mr-2" /> 
                        Descargar documento
                      </Button>
                    </div>
                    
                    <div className="mt-8 p-4 bg-linear-to-br from-[#11B4D9]/10 to-[#038C7F]/5 rounded-lg border border-[#11B4D9]/30 max-w-md">
                      <div className="flex items-start gap-2">
                        <File className="h-5 w-5 text-[#035AA6] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#0D0D0D]">
                            Consejo
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Para ver el contenido del documento, descárgalo y ábrelo con Microsoft Word u otro editor compatible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Vista para archivos desconocidos
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-linear-to-br from-[#07598C] to-[#035AA6] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <FileText className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0D0D0D] mb-2">
                        Archivo no compatible
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {getFileName(selectedPdfUrl)}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = selectedPdfUrl;
                          link.download = getFileName(selectedPdfUrl);
                          link.click();
                        }}
                        className="border-[#11B4D9]/30 text-[#035AA6] hover:bg-[#11B4D9]/10"
                      >
                        <Download className="h-4 w-4 mr-2" /> Descargar archivo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay CV disponible</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
