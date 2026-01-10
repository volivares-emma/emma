import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Middleware para verificar permisos según el rol
async function checkPermissions(requiredRoles: string[], req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  if (!requiredRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  
  return null;
}

// GET - Listar cursos
export async function GET(req: NextRequest) {
  const permissionCheck = await checkPermissions(['admin', 'editor', 'guest'], req);
  if (permissionCheck) return permissionCheck;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';
  const instructor = searchParams.get('instructor') || '';
  
  try {
    const where: any = {
      deleted_at: null,
    };

    // Si es editor, solo ve cursos que él creó
    if (session.user.role === 'editor') {
      where.created_by = parseInt(session.user.id);
    }

    // Si es guest, solo ve cursos asignados a él
    if (session.user.role === 'guest') {
      where.assignments = {
        some: {
          user_id: parseInt(session.user.id)
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { instructor: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (instructor) {
      where.instructor = { contains: instructor, mode: 'insensitive' };
    }

    // Solo mostrar cursos activos para guests
    if (session.user.role === 'guest') {
      where.is_active = true;
      where.status = 'published';
    }

    const [courses, total] = await Promise.all([
      prisma.tbl_courses.findMany({
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
            select: {
              id: true,
              title: true,
              material_type: true,
              is_required: true,
            }
          },
          _count: {
            select: {
              assignments: true,
              materials: true,
            }
          },
          // Para guests, incluir su progreso
          ...(session.user.role === 'guest' && {
            assignments: {
              where: {
                user_id: parseInt(session.user.id)
              },
              include: {
                progress: true
              }
            }
          })
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.tbl_courses.count({ where }),
    ]);

    return NextResponse.json({
      data: courses,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Crear curso
export async function POST(req: NextRequest) {
  const permissionCheck = await checkPermissions(['admin', 'editor'], req);
  if (permissionCheck) return permissionCheck;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
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
    } = await req.json();

    // Validaciones
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newCourse = await prisma.tbl_courses.create({
      data: {
        title,
        description,
        content,
        duration_hours: duration_hours || 0,
        instructor,
        category,
        meeting_link,
        max_students: max_students || 0,
        status: status || 'draft',
        created_by: parseInt(session.user.id),
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
        action: 'CREATE_COURSE',
        entity_type: 'courses',
        entity_id: newCourse.id,
        new_values: { title, status, category },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}