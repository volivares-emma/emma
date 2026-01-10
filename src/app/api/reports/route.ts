import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Generar reportes
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Solo admin, editor y reader pueden generar reportes
  if (!['admin', 'editor', 'reader'].includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  
  const reportType = searchParams.get('type'); // 'course', 'user', 'global'
  const courseId = searchParams.get('course_id');
  const userId = searchParams.get('user_id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  
  try {
    let reportData: any = {};

    // Filtros base según rol
    const baseFilter: any = {};
    if (session.user.role === 'editor') {
      baseFilter.OR = [
        {
          course: {
            created_by: parseInt(session.user.id)
          }
        },
        {
          user: {
            created_by: parseInt(session.user.id)
          }
        }
      ];
    }

    if (reportType === 'course' && courseId) {
      // Reporte específico de un curso
      const course = await prisma.tbl_courses.findFirst({
        where: {
          id: parseInt(courseId),
          deleted_at: null,
          ...(session.user.role === 'editor' && {
            created_by: parseInt(session.user.id)
          })
        },
        include: {
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  first_name: true,
                  last_name: true,
                }
              },
              progress: true
            }
          }
        }
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found or access denied" },
          { status: 404 }
        );
      }

      const totalAssigned = course.assignments.length;
      const totalCompleted = course.assignments.filter(a => a.status === 'completed').length;
      const totalInProgress = course.assignments.filter(a => a.status === 'in_progress').length;
      const totalPending = course.assignments.filter(a => a.status === 'pending').length;

      reportData = {
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          category: course.category,
          duration_hours: course.duration_hours,
        },
        statistics: {
          total_assigned: totalAssigned,
          total_completed: totalCompleted,
          total_in_progress: totalInProgress,
          total_pending: totalPending,
          completion_rate: totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0,
        },
        students: course.assignments.map(assignment => ({
          user: assignment.user,
          assignment_date: assignment.assigned_at,
          started_at: assignment.started_at,
          completed_at: assignment.completed_at,
          progress_percentage: assignment.progress?.progress_percentage || 0,
          status: assignment.status,
          time_spent_minutes: assignment.progress?.time_spent_minutes || 0,
        }))
      };

    } else if (reportType === 'user' && userId) {
      // Reporte específico de un usuario
      const user = await prisma.tbl_users.findFirst({
        where: {
          id: parseInt(userId),
          deleted_at: null,
          ...(session.user.role === 'editor' && {
            created_by: parseInt(session.user.id)
          })
        },
        include: {
          course_assignments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  instructor: true,
                  duration_hours: true,
                }
              },
              progress: true
            }
          },
          certificates: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                }
              }
            }
          }
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found or access denied" },
          { status: 404 }
        );
      }

      const totalAssigned = user.course_assignments.length;
      const totalCompleted = user.course_assignments.filter(a => a.status === 'completed').length;
      const totalInProgress = user.course_assignments.filter(a => a.status === 'in_progress').length;

      reportData = {
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        statistics: {
          total_courses_assigned: totalAssigned,
          total_courses_completed: totalCompleted,
          total_courses_in_progress: totalInProgress,
          total_certificates: user.certificates.length,
          completion_rate: totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0,
          total_hours_spent: user.course_assignments.reduce((sum, a) => 
            sum + (a.progress?.time_spent_minutes || 0), 0) / 60,
        },
        courses: user.course_assignments.map(assignment => ({
          course: assignment.course,
          assignment_date: assignment.assigned_at,
          started_at: assignment.started_at,
          completed_at: assignment.completed_at,
          progress_percentage: assignment.progress?.progress_percentage || 0,
          status: assignment.status,
          time_spent_minutes: assignment.progress?.time_spent_minutes || 0,
        }))
      };

    } else if (reportType === 'global') {
      // Reporte global del sistema
      const dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter.created_at = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const [totalCourses, totalUsers, totalAssignments, totalCompletions, totalCertificates] = await Promise.all([
        prisma.tbl_courses.count({
          where: {
            deleted_at: null,
            ...(session.user.role === 'editor' && {
              created_by: parseInt(session.user.id)
            }),
            ...dateFilter,
          }
        }),
        prisma.tbl_users.count({
          where: {
            deleted_at: null,
            ...(session.user.role === 'editor' && {
              created_by: parseInt(session.user.id)
            }),
            ...dateFilter,
          }
        }),
        prisma.tbl_course_assignments.count({
          where: {
            ...baseFilter,
            ...dateFilter,
          }
        }),
        prisma.tbl_course_assignments.count({
          where: {
            ...baseFilter,
            status: 'completed',
            ...dateFilter,
          }
        }),
        prisma.tbl_certificates.count({
          where: {
            ...baseFilter.OR && { OR: baseFilter.OR },
            ...dateFilter,
          }
        }),
      ]);

      reportData = {
        period: {
          start_date: startDate || null,
          end_date: endDate || null,
        },
        overview: {
          total_courses: totalCourses,
          total_users: totalUsers,
          total_assignments: totalAssignments,
          total_completions: totalCompletions,
          total_certificates_issued: totalCertificates,
          global_completion_rate: totalAssignments > 0 ? (totalCompletions / totalAssignments) * 100 : 0,
        }
      };
    } else {
      return NextResponse.json(
        { error: "Invalid report type or missing parameters" },
        { status: 400 }
      );
    }

    return NextResponse.json(reportData);

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}