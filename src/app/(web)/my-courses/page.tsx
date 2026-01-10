"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  CheckCircle, 
  FileText,
  Calendar,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";

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
    duration_hours?: number;
    difficulty_level?: string;
    status: string;
    materials?: any[];
  };
}

interface Certificate {
  id: number;
  course_title: string;
  issue_date: string;
  certificate_url?: string;
}

export default function MyCourses() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserAssignments();
      fetchUserCertificates();
    }
  }, [session, status]);

  const fetchUserAssignments = async () => {
    try {
      const response = await fetch(`/api/assignments?user_id=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCertificates = async () => {
    try {
      const response = await fetch(`/api/certificates?user_id=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
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

  const updateProgress = async (assignmentId: number, newProgress: number) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress'
        })
      });

      if (response.ok) {
        fetchUserAssignments();
        if (newProgress === 100) {
          fetchUserCertificates(); // Refrescar certificados si se completó
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">
              {status === "loading" ? "Verificando autenticación..." : "Cargando mis cursos..."}
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
            <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver tus cursos.</p>
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Mis Cursos</h1>
        </div>
        <p className="text-muted-foreground">
          Gestiona tu progreso y accede a tus materiales de capacitación
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <div className="text-xs text-muted-foreground">Total Asignados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'in_progress').length}
                </div>
                <div className="text-xs text-muted-foreground">En Progreso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-xs text-muted-foreground">Completados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{certificates.length}</div>
                <div className="text-xs text-muted-foreground">Certificados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="courses">Mis Cursos</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes cursos asignados</h3>
                <p className="text-muted-foreground">
                  Cuando se te asignen cursos, aparecerán aquí para que puedas comenzar tu capacitación.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {assignment.course.title}
                        </CardTitle>
                        {assignment.course.description && (
                          <CardDescription className="line-clamp-2">
                            {assignment.course.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusText(assignment.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{assignment.progress_percentage}%</span>
                      </div>
                      <Progress value={assignment.progress_percentage} className="h-2" />
                    </div>

                    {/* Course Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Asignado</div>
                          <div className="text-muted-foreground">
                            {formatDate(assignment.assigned_at)}
                          </div>
                        </div>
                      </div>

                      {assignment.due_date && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Fecha límite</div>
                            <div className="text-muted-foreground">
                              {formatDate(assignment.due_date)}
                            </div>
                          </div>
                        </div>
                      )}

                      {assignment.course.duration_hours && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Duración</div>
                            <div className="text-muted-foreground">
                              {assignment.course.duration_hours}h
                            </div>
                          </div>
                        </div>
                      )}

                      {assignment.course.difficulty_level && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Nivel</div>
                            <div className="text-muted-foreground capitalize">
                              {assignment.course.difficulty_level}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        asChild
                        className="flex-1"
                        variant={assignment.status === 'completed' ? 'outline' : 'default'}
                      >
                        <Link href={`/my-courses/${assignment.course_id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {assignment.status === 'completed' ? 'Revisar' : 'Continuar'}
                        </Link>
                      </Button>
                      
                      {assignment.status !== 'completed' && (
                        <Button
                          variant="outline"
                          onClick={() => updateProgress(assignment.id, 100)}
                        >
                          Marcar Completo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes certificados</h3>
                <p className="text-muted-foreground">
                  Completa tus cursos para obtener certificados de finalización.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <Card key={cert.id} className="text-center">
                  <CardContent className="p-6">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{cert.course_title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Emitido el {formatDate(cert.issue_date)}
                    </p>
                    {cert.certificate_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                          Descargar
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}