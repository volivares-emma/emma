"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  ArrowLeft, 
  Clock, 
  FileText, 
  Download,
  Play,
  CheckCircle,
  User,
  Calendar,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Evitar prerenderizado estático
export const dynamic = 'force-dynamic';

interface CourseAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_at: string;
  due_date?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  progress_percentage: number;
  completed_at?: string;
  notes?: string;
  course: {
    id: number;
    title: string;
    description?: string;
    content?: string;
    duration_hours?: number;
    difficulty_level?: string;
    status: string;
    materials?: Array<{
      id: number;
      filename: string;
      path: string;
      file_type: string;
      file_size: number;
    }>;
  };
}

interface CourseDetailProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetail(props: CourseDetailProps) {
  const params = await props.params;
  
  return <CourseDetailContent params={params} />;
}

function CourseDetailContent({ params }: { params: { courseId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignment, setAssignment] = useState<CourseAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && params.courseId) {
      fetchCourseAssignment();
    }
  }, [session, status, params.courseId]);

  const fetchCourseAssignment = async () => {
    try {
      const response = await fetch(
        `/api/assignments?user_id=${session?.user?.id}&course_id=${params.courseId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setAssignment(data.data[0]);
        } else {
          toast.error("No tienes acceso a este curso");
          router.push('/my-courses');
        }
      }
    } catch (error) {
      console.error("Error fetching course assignment:", error);
      toast.error("Error al cargar el curso");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!assignment) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/assignments/${assignment.id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress'
        })
      });

      if (response.ok) {
        setAssignment(prev => prev ? {
          ...prev,
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress',
          completed_at: newProgress === 100 ? new Date().toISOString() : prev.completed_at
        } : null);
        
        toast.success(
          newProgress === 100 
            ? "¡Curso completado! Certificado generado."
            : "Progreso actualizado"
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Error al actualizar progreso");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'overdue': return 'Vencido';
      case 'assigned': return 'Asignado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">
              {status === "loading" ? "Verificando autenticación..." : "Cargando curso..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso Requerido</h2>
            <p className="text-muted-foreground mb-4">Debes iniciar sesión para acceder a este curso.</p>
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
          <Button asChild>
            <Link href="/my-courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const course = assignment.course;

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/my-courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Cursos
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {course.description && (
              <p className="text-muted-foreground text-lg">
                {course.description}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(assignment.status)}>
            {getStatusText(assignment.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Contenido del Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.content ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.content }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No hay contenido disponible para este curso.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Materials */}
          {course.materials && course.materials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Materiales del Curso
                </CardTitle>
                <CardDescription>
                  Descarga los materiales necesarios para completar el curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.materials.map((material) => (
                    <div 
                      key={material.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{material.filename}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.file_type.toUpperCase()} • {formatFileSize(material.file_size)}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={`/api/files/${material.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tu Progreso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completado</span>
                  <span className="font-medium">{assignment.progress_percentage}%</span>
                </div>
                <Progress value={assignment.progress_percentage} className="h-3" />
              </div>

              {assignment.status !== 'completed' && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Actualizar progreso:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProgress(50)}
                      disabled={updating || assignment.progress_percentage >= 50}
                    >
                      50%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProgress(75)}
                      disabled={updating || assignment.progress_percentage >= 75}
                    >
                      75%
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => updateProgress(100)}
                    disabled={updating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Completado
                  </Button>
                </div>
              )}

              {assignment.status === 'completed' && assignment.completed_at && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">
                    Curso Completado
                  </p>
                  <p className="text-xs text-green-600">
                    {formatDate(assignment.completed_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Fecha de asignación</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(assignment.assigned_at)}
                  </div>
                </div>
              </div>

              {assignment.due_date && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Fecha límite</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(assignment.due_date)}
                    </div>
                  </div>
                </div>
              )}

              {course.duration_hours && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Duración estimada</div>
                    <div className="text-sm text-muted-foreground">
                      {course.duration_hours} horas
                    </div>
                  </div>
                </div>
              )}

              {course.difficulty_level && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Nivel de dificultad</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {course.difficulty_level}
                    </div>
                  </div>
                </div>
              )}

              {assignment.notes && (
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium mb-1">Notas</div>
                  <div className="text-sm text-muted-foreground">
                    {assignment.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}