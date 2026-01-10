import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET - Obtener un curso específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const params = await context.params;
  const courseId = parseInt(params.id);
  
  try {
    const where: any = {
      id: courseId,
      deleted_at: null,
    };

    // Si es editor, solo puede ver cursos que él creó
    if (session.user.role === 'editor') {
      where.created_by = parseInt(session.user.id);
    }

    const course = await prisma.tbl_courses.findFirst({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
          }
        },
        materials: {
          orderBy: { sort_order: 'asc' }
        },
        assignments: session.user.role === 'guest' ? {
          where: {
            user_id: parseInt(session.user.id)
          },
          include: {
            progress: true
          }
        } : {
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
        },
        _count: {
          select: {
            assignments: true,
            materials: true,
          }
        }
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Para guests, verificar que tengan acceso al curso
    if (session.user.role === 'guest') {
      const hasAccess = course.assignments.length > 0;
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Access denied to this course" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(course);

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar curso
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Solo admin y editor pueden editar
  if (!['admin', 'editor'].includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const params = await context.params;
  const courseId = parseInt(params.id);
  
  try {
    const {
      title,
      description,
      content,
      duration_hours,
      instructor,
      category,
      meeting_link,
      max_students,
      status,
      is_active,
    } = await request.json();

    // Verificar que el curso existe y que tiene permisos
    const existingCourse = await prisma.tbl_courses.findFirst({
      where: {
        id: courseId,
        deleted_at: null,
        ...(session.user.role === 'editor' && {
          created_by: parseInt(session.user.id)
        })
      }
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 }
      );
    }

    const updatedCourse = await prisma.tbl_courses.update({
      where: { id: courseId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(duration_hours !== undefined && { duration_hours }),
        ...(instructor !== undefined && { instructor }),
        ...(category !== undefined && { category }),
        ...(meeting_link !== undefined && { meeting_link }),
        ...(max_students !== undefined && { max_students }),
        ...(status !== undefined && { status }),
        ...(is_active !== undefined && { is_active }),
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
          }
        }
      },
    });

    // Log de auditoría
    await prisma.tbl_audit_logs.create({
      data: {
        user_id: parseInt(session.user.id),
        action: 'UPDATE_COURSE',
        entity_type: 'courses',
        entity_id: courseId,
        old_values: {
          title: existingCourse.title,
          status: existingCourse.status,
          is_active: existingCourse.is_active
        },
        new_values: { title, status, is_active },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(updatedCourse);

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar curso (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Solo admin y editor pueden eliminar
  if (!['admin', 'editor'].includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const params = await context.params;
  const courseId = parseInt(params.id);
  
  try {
    // Verificar que el curso existe y que tiene permisos
    const existingCourse = await prisma.tbl_courses.findFirst({
      where: {
        id: courseId,
        deleted_at: null,
        ...(session.user.role === 'editor' && {
          created_by: parseInt(session.user.id)
        })
      }
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.tbl_courses.update({
      where: { id: courseId },
      data: {
        deleted_at: new Date(),
        is_active: false,
      },
    });

    // Log de auditoría
    await prisma.tbl_audit_logs.create({
      data: {
        user_id: parseInt(session.user.id),
        action: 'DELETE_COURSE',
        entity_type: 'courses',
        entity_id: courseId,
        old_values: {
          title: existingCourse.title,
          status: existingCourse.status
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ message: "Course deleted successfully" });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}