import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Listar certificados
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '10');
  const userId = searchParams.get('user_id');
  const courseId = searchParams.get('course_id');
  
  try {
    const where: any = {};

    // Filtros según el rol
    if (session.user.role === 'guest') {
      // Solo ve sus propios certificados
      where.user_id = parseInt(session.user.id);
    } else if (session.user.role === 'editor') {
      // Solo ve certificados de usuarios que él creó o cursos que él creó
      where.OR = [
        {
          user: {
            created_by: parseInt(session.user.id)
          }
        },
        {
          course: {
            created_by: parseInt(session.user.id)
          }
        }
      ];
    }

    if (userId) {
      where.user_id = parseInt(userId);
    }

    if (courseId) {
      where.course_id = parseInt(courseId);
    }

    const [certificates, total] = await Promise.all([
      prisma.tbl_certificates.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              category: true,
              instructor: true,
              duration_hours: true,
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { issued_at: 'desc' },
      }),
      prisma.tbl_certificates.count({ where }),
    ]);

    return NextResponse.json({
      data: certificates,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}