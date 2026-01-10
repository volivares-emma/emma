import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// GET - Obtener materiales de un curso
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
    // Verificar acceso al curso
    const course = await prisma.tbl_courses.findFirst({
      where: {
        id: courseId,
        deleted_at: null,
        ...(session.user.role === 'guest' && {
          assignments: {
            some: {
              user_id: parseInt(session.user.id)
            }
          }
        }),
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

    const materials = await prisma.tbl_course_materials.findMany({
      where: {
        course_id: courseId,
      },
      orderBy: { sort_order: 'asc' },
    });

    return NextResponse.json(materials);

  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Agregar material a un curso
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Solo admin y control_interno pueden agregar materiales
  if (!['admin', 'control_interno'].includes(session.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const params = await context.params;
  const courseId = parseInt(params.id);
  
  try {
    const {
      title,
      description,
      file_path,
      file_url,
      material_type,
      file_size,
      sort_order,
      is_required,
    } = await request.json();

    // Validaciones
    if (!title || !material_type) {
      return NextResponse.json(
        { error: "Title and material type are required" },
        { status: 400 }
      );
    }

    // Verificar acceso al curso
    const course = await prisma.tbl_courses.findFirst({
      where: {
        id: courseId,
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

    const material = await prisma.tbl_course_materials.create({
      data: {
        course_id: courseId,
        title,
        description,
        file_path,
        file_url,
        material_type,
        file_size: file_size || 0,
        sort_order: sort_order || 0,
        is_required: is_required || false,
      }
    });

    // Log de auditoría
    await prisma.tbl_audit_logs.create({
      data: {
        user_id: parseInt(session.user.id),
        action: 'ADD_MATERIAL',
        entity_type: 'course_materials',
        entity_id: material.id,
        new_values: { title, material_type, course_id: courseId },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(material, { status: 201 });

  } catch (error) {
    console.error('Error adding material:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}