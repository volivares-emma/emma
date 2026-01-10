import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// PUT - Actualizar progreso
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const resolvedParams = await params;
  const assignmentId = parseInt(resolvedParams.id);
  
  try {
    const {
      progress_percentage,
      current_module,
      time_spent_minutes,
      completion_notes,
      status,
    } = await req.json();

    // Verificar que la asignación existe
    const assignment = await prisma.tbl_course_assignments.findFirst({
      where: {
        id: assignmentId,
        // Solo el usuario asignado o admin/editor pueden actualizar
        ...(session.user.role === 'guest' && {
          user_id: parseInt(session.user.id)
        }),
        ...(session.user.role === 'editor' && {
          OR: [
            { user_id: parseInt(session.user.id) },
            { course: { created_by: parseInt(session.user.id) } },
            { user: { created_by: parseInt(session.user.id) } }
          ]
        })
      },
      include: {
        progress: true,
        course: true,
        user: true,
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found or access denied" },
        { status: 404 }
      );
    }

    // Actualizar progreso
    const updatedProgress = await prisma.tbl_course_progresses.update({
      where: { assignment_id: assignmentId },
      data: {
        ...(progress_percentage !== undefined && { progress_percentage }),
        ...(current_module !== undefined && { current_module }),
        ...(time_spent_minutes !== undefined && { 
          time_spent_minutes: assignment.progress?.time_spent_minutes 
            ? assignment.progress.time_spent_minutes + time_spent_minutes 
            : time_spent_minutes 
        }),
        ...(completion_notes !== undefined && { completion_notes }),
        last_accessed_at: new Date(),
      }
    });

    // Si es la primera vez que accede, marcar como iniciado
    if (assignment.status === 'pending' && progress_percentage > 0) {
      await prisma.tbl_course_assignments.update({
        where: { id: assignmentId },
        data: {
          status: 'in_progress',
          started_at: new Date(),
        }
      });
    }

    // Si completó el curso
    if (progress_percentage >= 100 || status === 'completed') {
      await prisma.tbl_course_assignments.update({
        where: { id: assignmentId },
        data: {
          status: 'completed',
          completed_at: new Date(),
        }
      });

      // Generar certificado si no existe
      const existingCertificate = await prisma.tbl_certificates.findFirst({
        where: {
          user_id: assignment.user_id,
          course_id: assignment.course_id,
        }
      });

      if (!existingCertificate) {
        const certificateCode = `CERT-${assignment.course_id}-${assignment.user_id}-${Date.now()}`;
        
        await prisma.tbl_certificates.create({
          data: {
            user_id: assignment.user_id,
            course_id: assignment.course_id,
            certificate_code: certificateCode,
          }
        });
      }
    }

    // Log de auditoría
    await prisma.tbl_audit_logs.create({
      data: {
        user_id: parseInt(session.user.id),
        action: 'UPDATE_PROGRESS',
        entity_type: 'course_progresses',
        entity_id: updatedProgress.id,
        old_values: {
          progress_percentage: assignment.progress?.progress_percentage,
          status: assignment.status
        },
        new_values: { progress_percentage, status },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      progress: updatedProgress,
      message: progress_percentage >= 100 ? "Course completed! Certificate generated." : "Progress updated successfully"
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}