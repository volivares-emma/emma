"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Mail, 
  Briefcase, 
  Bell, 
  ClipboardList, 
  Image, 
  Users, 
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BookOpen,
  UserCheck,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    growth_rate: number;
  };
  courses: {
    total: number;
    published: number;
    enrollments: number;
    completion_rate: number;
  };
  content: {
    blogs: number;
    slides: number;
    testimonials: number;
    notifications: number;
  };
  recruitment: {
    job_positions: number;
    recruitments: number;
    contacts: number;
    subscriptions: number;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Hacer llamadas para obtener estadísticas reales
      const responses = await Promise.allSettled([
        fetch('/api/users?pageSize=1'),
        fetch('/api/courses?pageSize=1'),
        fetch('/api/assignments?pageSize=1'),
        fetch('/api/certificates?pageSize=1'),
        fetch('/api/blogs?pageSize=1'),
        fetch('/api/slides?pageSize=1'),
        fetch('/api/testimonials?pageSize=1'),
        fetch('/api/notifications?pageSize=1'),
        fetch('/api/job-positions?pageSize=1'),
        fetch('/api/recruitments?pageSize=1'),
        fetch('/api/contacts?pageSize=1'),
        fetch('/api/subscriptions?pageSize=1')
      ]);

      // Procesar respuestas
      const getData = async (response: any, index: number) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          return await response.value.json();
        }
        return { total: 0, data: [] };
      };

      const [
        users,
        courses,
        assignments,
        certificates,
        blogs,
        slides,
        testimonials,
        notifications,
        jobPositions,
        recruitments,
        contacts,
        subscriptions
      ] = await Promise.all(responses.map(getData));

      // Calcular estadísticas reales
      const activeUsers = users.data?.filter((user: any) => user.is_active).length || 0;
      const publishedCourses = courses.data?.filter((course: any) => course.status === 'published').length || 0;
      const completedAssignments = assignments.data?.filter((assignment: any) => assignment.status === 'completed').length || 0;
      const totalAssignments = assignments.total || 0;
      const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
      
      // Calcular usuarios nuevos del mes actual
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newUsersThisMonth = users.data?.filter((user: any) => {
        const userDate = new Date(user.created_at);
        return userDate >= firstDayOfMonth;
      }).length || 0;

      // Crear actividad reciente real
      const recentActivity: any[] = [];
      
      // Agregar usuarios recientes
      if (users.data?.length > 0) {
        const recentUsers = users.data
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2);
        
        recentUsers.forEach((user: any) => {
          recentActivity.push({
            id: `user-${user.id}`,
            type: 'user',
            message: `Nuevo usuario registrado: ${user.username}`,
            time: formatTimeAgo(user.created_at),
            status: 'success'
          });
        });
      }

      // Agregar cursos recientes
      if (courses.data?.length > 0) {
        const recentCourses = courses.data
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2);
        
        recentCourses.forEach((course: any) => {
          recentActivity.push({
            id: `course-${course.id}`,
            type: 'course',
            message: `Nuevo curso creado: ${course.title}`,
            time: formatTimeAgo(course.created_at),
            status: 'success'
          });
        });
      }

      // Agregar asignaciones recientes
      if (assignments.data?.length > 0) {
        const recentAssignments = assignments.data
          .sort((a: any, b: any) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime())
          .slice(0, 1);
        
        recentAssignments.forEach((assignment: any) => {
          const status = assignment.status === 'completed' ? 'success' : 'warning';
          const message = assignment.status === 'completed' 
            ? `Curso completado por ${assignment.user?.username || 'usuario'}`
            : `Nueva asignación de curso a ${assignment.user?.username || 'usuario'}`;
            
          recentActivity.push({
            id: `assignment-${assignment.id}`,
            type: 'course',
            message,
            time: formatTimeAgo(assignment.assigned_at),
            status
          });
        });
      }

      // Ordenar actividad por fecha y tomar las 5 más recientes
      const sortedActivity = recentActivity
        .sort((a, b) => {
          // Convertir tiempo relativo a timestamp para ordenar
          const timeA = parseTimeAgo(a.time);
          const timeB = parseTimeAgo(b.time);
          return timeA - timeB;
        })
        .slice(0, 5);

      const dashboardStats: DashboardStats = {
        users: {
          total: users.total || 0,
          active: activeUsers,
          new_this_month: newUsersThisMonth,
          growth_rate: users.total > 0 ? Math.round((newUsersThisMonth / users.total) * 100) : 0,
        },
        courses: {
          total: courses.total || 0,
          published: publishedCourses,
          enrollments: totalAssignments,
          completion_rate: completionRate,
        },
        content: {
          blogs: blogs.total || 0,
          slides: slides.total || 0,
          testimonials: testimonials.total || 0,
          notifications: notifications.total || 0,
        },
        recruitment: {
          job_positions: jobPositions.total || 0,
          recruitments: recruitments.total || 0,
          contacts: contacts.total || 0,
          subscriptions: subscriptions.total || 0,
        },
        recent_activity: sortedActivity.length > 0 ? sortedActivity : [{
          id: 'no-activity',
          type: 'system',
          message: 'No hay actividad reciente',
          time: 'ahora',
          status: 'success'
        }]
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para formatear tiempo relativo
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'ahora';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Función auxiliar para convertir tiempo relativo a número para ordenar
  const parseTimeAgo = (timeString: string): number => {
    if (timeString === 'ahora') return 0;
    if (timeString.includes('min')) return parseInt(timeString);
    if (timeString.includes('h')) return parseInt(timeString) * 60;
    if (timeString.includes('d')) return parseInt(timeString) * 60 * 24;
    return 999999; // Para fechas más antiguas
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const quickActions = [
    { name: "Crear Usuario", href: "/admin/users", icon: <User className="h-5 w-5" />, color: "bg-blue-500" },
    { name: "Nuevo Curso", href: "/admin/courses", icon: <BookOpen className="h-5 w-5" />, color: "bg-green-500" },
    { name: "Escribir Blog", href: "/admin/blogs", icon: <FileText className="h-5 w-5" />, color: "bg-purple-500" },
    { name: "Ver Reportes", href: "/admin/reports", icon: <BarChart3 className="h-5 w-5" />, color: "bg-orange-500" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de administración de EMMA
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Sistema Activo
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Actualizado hace {new Date().getHours()}h
          </Badge>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.users.growth_rate}%
              </span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses.published}</div>
            <p className="text-xs text-muted-foreground">
              {stats.courses.total} cursos totales
            </p>
            <div className="mt-2">
              <Progress 
                value={(stats.courses.published / (stats.courses.total || 1)) * 100} 
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matriculaciones</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses.enrollments}</div>
            <p className="text-xs text-muted-foreground">
              Tasa de finalización: {stats.courses.completion_rate}%
            </p>
            <div className="mt-2">
              <Progress value={stats.courses.completion_rate} className="h-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.new_this_month} nuevos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Estadísticas de Contenido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gestión de Contenido</CardTitle>
            <CardDescription>
              Estado actual del contenido en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Blogs</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.content.blogs}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/blogs">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-green-500" />
                <span className="font-medium">Slides</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.content.slides}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/slides">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Testimonios</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.content.testimonials}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/testimonials">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Notificaciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.content.notifications}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/notifications">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de Reclutamiento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reclutamiento & HR</CardTitle>
            <CardDescription>
              Gestión de recursos humanos y contactos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Posiciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.recruitment.job_positions}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/job-positions">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Reclutamientos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.recruitment.recruitments}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/recruitments">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="font-medium">Contactos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.recruitment.contacts}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/contacts">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span className="font-medium">Suscripciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{stats.recruitment.subscriptions}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/subscriptions">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_activity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant="outline"
                size="lg"
                asChild
                className="h-24 flex-col space-y-"
              >
                <Link href={action.href}>
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium">{action.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sistema EMMA - Destacado */}
      <Card className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center">
            <div className="p-2 rounded-lg bg-blue-600 text-white mr-3">
              <BookOpen className="h-6 w-6" />
            </div>
            Sistema EMMA - Gestión de Capacitación
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
              Activo
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Plataforma completa para gestionar cursos, asignaciones y certificaciones empresariales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card de Cursos */}
            <div className="group">
              <Link href="/admin/courses" className="block">
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 border-blue-200 bg-white">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stats.courses.total}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">Cursos</h3>
                      <p className="text-xs text-muted-foreground">
                        {stats.courses.published} publicados
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Card de Asignaciones */}
            <div className="group">
              <Link href="/admin/assignments" className="block">
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 border-green-200 bg-white">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stats.courses.enrollments}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">Asignaciones</h3>
                      <p className="text-xs text-muted-foreground">
                        {stats.courses.completion_rate}% completadas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Card de Certificados */}
            <div className="group">
              <Link href="/admin/certificates" className="block">
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 border-yellow-200 bg-white">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">Certificados</h3>
                      <p className="text-xs text-muted-foreground">
                        Sistema de certificación
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Card de Reportes */}
            <div className="group">
              <Link href="/admin/reports" className="block">
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 border-purple-200 bg-white">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">Reportes</h3>
                      <p className="text-xs text-muted-foreground">
                        Analytics avanzados
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Indicadores de rendimiento */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Métricas de Rendimiento
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.courses.total}</div>
                <div className="text-xs text-muted-foreground">Cursos Totales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.courses.enrollments}</div>
                <div className="text-xs text-muted-foreground">Inscripciones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.courses.completion_rate}%</div>
                <div className="text-xs text-muted-foreground">Tasa de Finalización</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

