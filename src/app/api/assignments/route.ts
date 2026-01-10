import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Listar asignaciones
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '10');
  const courseId = searchParams.get('course_id');
  const userId = searchParams.get('user_id');
  const status = searchParams.get('status');
  
  try {
    const where: any = {};

    // Filtros según el rol
    if (session.user.role === 'editor') {
      // Solo ve asignaciones de cursos que él creó o usuarios que él creó
      where.OR = [
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

    if (session.user.role === 'guest') {
      // Solo ve sus propias asignaciones
      where.user_id = parseInt(session.user.id);
    }

    if (courseId) {
      where.course_id = parseInt(courseId);
    }

    if (userId) {
      where.user_id = parseInt(userId);
    }

    if (status) {
      where.status = status;
    }

    const [assignments, total] = await Promise.all([
      prisma.tbl_course_assignments.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              category: true,
              instructor: true,
              meeting_link: true,
              duration_hours: true,
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
            }
          },
          progress: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.tbl_course_assignments.count({ where }),
    ]);

    return NextResponse.json({
      data: assignments,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Crear asignación
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Solo admin y editor pueden asignar cursos
  if (!['admin', 'editor'].includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  
  try {
    const {
      course_id,
      user_ids,
      due_date,
      notes,
    } = await req.json();

    // Validaciones
    if (!course_id || !user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json(
        { error: "Course ID and user IDs are required" },
        { status: 400 }
      );
    }

    // Verificar que el curso existe
    const course = await prisma.tbl_courses.findFirst({
      where: {
        id: course_id,
        deleted_at: null,
        ...(session.user.role === 'editor' && {
          created_by: parseInt(session.user.id)
        })
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 }
      );
    }

    // Verificar que los usuarios existen
    const usersWhere: any = {
      id: { in: user_ids },
      deleted_at: null,
    };

    // Editor solo puede asignar a usuarios que él creó
    if (session.user.role === 'editor') {
      usersWhere.created_by = parseInt(session.user.id);
    }

    const users = await prisma.tbl_users.findMany({
      where: usersWhere,
      select: { id: true }
    });

    if (users.length !== user_ids.length) {
      return NextResponse.json(
        { error: "Some users not found or access denied" },
        { status: 400 }
      );
    }

    // Crear asignaciones
    const assignments = [];
    for (const userId of user_ids) {
      // Verificar si ya existe la asignación
      const existingAssignment = await prisma.tbl_course_assignments.findFirst({
        where: {
          course_id,
          user_id: userId
        }
      });

      if (!existingAssignment) {
        const assignment = await prisma.tbl_course_assignments.create({
          data: {
            course_id,
            user_id: userId,
            assigned_by: parseInt(session.user.id),
            due_date: due_date ? new Date(due_date) : null,
            notes,
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                instructor: true,
              }
            },
            user: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
              }
            }
          },
        });

        // Crear registro de progreso inicial
        await prisma.tbl_course_progresses.create({
          data: {
            assignment_id: assignment.id,
            user_id: userId,
            course_id,
            progress_percentage: 0,
          }
        });

        assignments.push(assignment);

        // Log de auditoría
        await prisma.tbl_audit_logs.create({
          data: {
            user_id: parseInt(session.user.id),
            action: 'ASSIGN_COURSE',
            entity_type: 'course_assignments',
            entity_id: assignment.id,
            new_values: { course_id, user_id: userId },
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            user_agent: req.headers.get('user-agent'),
          },
        });
      }
    }

    return NextResponse.json({
      message: `${assignments.length} assignments created successfully`,
      assignments
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating assignments:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}