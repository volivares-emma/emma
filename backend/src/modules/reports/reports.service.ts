import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Course } from '../courses/entities/course.entity';
import { CourseAssignment } from '../courses/entities/course-assignment.entity';
import { AssignmentStatus } from '../courses/entities/assignment-status.enum';
import { CourseProgress } from '../courses/entities/course-progress.entity';
import { Certificate } from '../courses/entities/certificate.entity';
import { User } from '../users/entities/user.entity';

export interface CourseReportData {
  course: {
    id: number;
    title: string;
    instructor: string | null;
  };
  stats: {
    totalAssignments: number;
    completedAssignments: number;
    completionRate: number;
    certificates: number;
    averageProgress: number;
  };
}

export interface UserReportData {
  user: {
    id: number;
    name: string;
    email: string;
  };
  stats: {
    enrolledCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    certificates: number;
  };
  courses: Array<{
    id: number;
    title: string;
    status: string;
    progress: number;
  }>;
}

export interface GlobalReportData {
  stats: {
    totalCourses: number;
    totalUsers: number;
    totalAssignments: number;
    completedAssignments: number;
    completionRate: number;
    totalCertificates: number;
  };
}

type ReportData = CourseReportData | UserReportData | GlobalReportData;

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseAssignment)
    private readonly assignmentRepository: Repository<CourseAssignment>,
    @InjectRepository(CourseProgress)
    private readonly progressRepository: Repository<CourseProgress>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateReport(params: {
    type: 'course' | 'user' | 'global';
    courseId?: number;
    userId?: number;
    startDate?: string;
    endDate?: string;
    currentUserId: number;
    userRole: string;
  }): Promise<ReportData> {
    const {
      type,
      courseId,
      userId,
      startDate,
      endDate,
      currentUserId,
      userRole,
    } = params;

    if (type === 'course' && courseId) {
      return await this.getCourseReport(
        courseId,
        currentUserId,
        userRole,
        startDate,
        endDate,
      );
    } else if (type === 'user' && userId) {
      return await this.getUserReport(
        userId,
        currentUserId,
        userRole,
        startDate,
        endDate,
      );
    } else if (type === 'global') {
      return await this.getGlobalReport(
        currentUserId,
        userRole,
        startDate,
        endDate,
      );
    } else {
      throw new Error('Invalid report type or missing required parameters');
    }
  }

  async generateReportFile(
    params: {
      type: 'course' | 'user' | 'global';
      courseId?: number;
      userId?: number;
      startDate?: string;
      endDate?: string;
      currentUserId: number;
      userRole: string;
    },
    format: 'pdf' | 'excel',
  ): Promise<{ buffer: Buffer; contentType: string; fileName: string }> {
    const report = await this.generateReport(params);
    const title = this.getReportTitle(params);
    const date = new Date().toISOString().split('T')[0];

    if (format === 'pdf') {
      const buffer = await this.buildPdf(report, title);
      return {
        buffer,
        contentType: 'application/pdf',
        fileName: `report-${params.type}-${date}.pdf`,
      };
    }

    const buffer = await this.buildExcel(report, title);
    return {
      buffer,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileName: `report-${params.type}-${date}.xlsx`,
    };
  }

  private async getCourseReport(
    courseId: number,
    currentUserId: number,
    userRole: string,
    startDate?: string,
    endDate?: string,
  ): Promise<CourseReportData> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['creator'],
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Verificar permisos
    if (userRole === 'editor' && course.created_by !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    const whereDate = this.getDateFilter(startDate, endDate);

    const assignments = await this.assignmentRepository.count({
      where: { course_id: courseId, ...whereDate },
    });

    const completedAssignments = await this.assignmentRepository.count({
      where: {
        course_id: courseId,
        status: AssignmentStatus.COMPLETED,
        ...whereDate,
      },
    });

    const certificates = await this.certificateRepository.count({
      where: { course_id: courseId, ...whereDate },
    });

    const avgProgress = await this.progressRepository
      .createQueryBuilder('progress')
      .innerJoin('progress.assignment', 'assignment')
      .where('assignment.course_id = :courseId', { courseId })
      .select('AVG(progress.progress_percentage)', 'avg')
      .getRawOne<{ avg: string | null }>();

    return {
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
      },
      stats: {
        totalAssignments: assignments,
        completedAssignments,
        completionRate:
          assignments > 0 ? (completedAssignments / assignments) * 100 : 0,
        certificates,
        averageProgress: parseFloat(avgProgress?.avg || '0'),
      },
    };
  }

  private async getUserReport(
    userId: number,
    currentUserId: number,
    userRole: string,
    startDate?: string,
    endDate?: string,
  ): Promise<UserReportData> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verificar permisos
    if (userRole === 'editor' && user.created_by !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    if (userRole === 'guest' && userId !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    const whereDate = this.getDateFilter(startDate, endDate);

    const assignments = await this.assignmentRepository.find({
      where: { user_id: userId, ...whereDate },
      relations: ['course', 'progress'],
    });

    const certificates = await this.certificateRepository.count({
      where: { user_id: userId, ...whereDate },
    });

    const completedCourses = assignments.filter(
      (a) => a.status === AssignmentStatus.COMPLETED,
    ).length;

    return {
      user: {
        id: user.id,
        name:
          `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
          user.username,
        email: user.email,
      },
      stats: {
        enrolledCourses: assignments.length,
        completedCourses,
        inProgressCourses: assignments.filter(
          (a) => a.status === AssignmentStatus.IN_PROGRESS,
        ).length,
        certificates,
      },
      courses: assignments.map((a) => ({
        id: a.course.id,
        title: a.course.title,
        status: a.status,
        progress: a.progress?.progress_percentage || 0,
      })),
    };
  }

  private async getGlobalReport(
    currentUserId: number,
    userRole: string,
    startDate?: string,
    endDate?: string,
  ): Promise<GlobalReportData> {
    const whereDate = this.getDateFilter(startDate, endDate);

    let courseWhere: FindOptionsWhere<Course> = whereDate;
    let userWhere: FindOptionsWhere<User> = whereDate;

    if (userRole === 'editor') {
      courseWhere = { ...whereDate, created_by: currentUserId };
      userWhere = { ...whereDate, created_by: currentUserId };
    }

    const totalCourses = await this.courseRepository.count({
      where: courseWhere,
    });
    const totalUsers = await this.userRepository.count({ where: userWhere });
    const totalAssignments = await this.assignmentRepository.count({
      where: whereDate,
    });
    const completedAssignments = await this.assignmentRepository.count({
      where: { ...whereDate, status: AssignmentStatus.COMPLETED },
    });
    const totalCertificates = await this.certificateRepository.count({
      where: whereDate,
    });

    return {
      stats: {
        totalCourses,
        totalUsers,
        totalAssignments,
        completedAssignments,
        completionRate:
          totalAssignments > 0
            ? (completedAssignments / totalAssignments) * 100
            : 0,
        totalCertificates,
      },
    };
  }

  private getDateFilter(
    startDate?: string,
    endDate?: string,
  ): Record<string, any> {
    const filter: Record<string, any> = {};

    if (startDate && endDate) {
      filter.created_at = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      filter.created_at = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      filter.created_at = LessThanOrEqual(new Date(endDate));
    }

    return filter;
  }

  private getReportTitle(params: {
    type: 'course' | 'user' | 'global';
    courseId?: number;
    userId?: number;
  }): string {
    if (params.type === 'course') {
      return `Reporte de Curso${params.courseId ? ` #${params.courseId}` : ''}`;
    }
    if (params.type === 'user') {
      return `Reporte de Usuario${params.userId ? ` #${params.userId}` : ''}`;
    }
    return 'Reporte Global';
  }

  private async buildPdf(report: ReportData, title: string): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    const bufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));
    });

    doc.fontSize(18).text(title, { align: 'left' });
    doc.moveDown();

    if ('stats' in report && 'totalCourses' in report.stats) {
      doc.fontSize(14).text('Resumen Global');
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Total cursos: ${report.stats.totalCourses}`);
      doc.text(`Total usuarios: ${report.stats.totalUsers}`);
      doc.text(`Total asignaciones: ${report.stats.totalAssignments}`);
      doc.text(
        `Asignaciones completadas: ${report.stats.completedAssignments}`,
      );
      doc.text(
        `Tasa de finalización: ${report.stats.completionRate.toFixed(2)}%`,
      );
      doc.text(`Total certificados: ${report.stats.totalCertificates}`);
    } else if ('course' in report) {
      doc.fontSize(14).text('Curso');
      doc.moveDown(0.5);
      doc.fontSize(11).text(`ID: ${report.course.id}`);
      doc.text(`Título: ${report.course.title}`);
      doc.text(`Instructor: ${report.course.instructor || 'N/A'}`);
      doc.moveDown();
      doc.fontSize(14).text('Estadísticas');
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Asignaciones: ${report.stats.totalAssignments}`);
      doc.text(`Completadas: ${report.stats.completedAssignments}`);
      doc.text(
        `Tasa de finalización: ${report.stats.completionRate.toFixed(2)}%`,
      );
      doc.text(`Certificados: ${report.stats.certificates}`);
      doc.text(
        `Progreso promedio: ${report.stats.averageProgress.toFixed(2)}%`,
      );
    } else if ('user' in report) {
      doc.fontSize(14).text('Usuario');
      doc.moveDown(0.5);
      doc.fontSize(11).text(`ID: ${report.user.id}`);
      doc.text(`Nombre: ${report.user.name}`);
      doc.text(`Email: ${report.user.email}`);
      doc.moveDown();
      doc.fontSize(14).text('Estadísticas');
      doc.moveDown(0.5);
      doc
        .fontSize(11)
        .text(`Cursos inscritos: ${report.stats.enrolledCourses}`);
      doc.text(`Cursos completados: ${report.stats.completedCourses}`);
      doc.text(`En progreso: ${report.stats.inProgressCourses}`);
      doc.text(`Certificados: ${report.stats.certificates}`);

      if (report.courses.length > 0) {
        doc.moveDown();
        doc.fontSize(14).text('Cursos');
        doc.moveDown(0.5);
        report.courses.forEach((course) => {
          doc
            .fontSize(11)
            .text(`${course.title} - ${course.status} (${course.progress}%)`);
        });
      }
    }

    doc.end();
    return bufferPromise;
  }

  private async buildExcel(report: ReportData, title: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte');

    sheet.addRow([title]);
    sheet.addRow([]);

    if ('stats' in report && 'totalCourses' in report.stats) {
      sheet.addRow(['Total cursos', report.stats.totalCourses]);
      sheet.addRow(['Total usuarios', report.stats.totalUsers]);
      sheet.addRow(['Total asignaciones', report.stats.totalAssignments]);
      sheet.addRow([
        'Asignaciones completadas',
        report.stats.completedAssignments,
      ]);
      sheet.addRow(['Tasa de finalización', report.stats.completionRate]);
      sheet.addRow(['Total certificados', report.stats.totalCertificates]);
    } else if ('course' in report) {
      sheet.addRow(['ID curso', report.course.id]);
      sheet.addRow(['Título', report.course.title]);
      sheet.addRow(['Instructor', report.course.instructor || 'N/A']);
      sheet.addRow([]);
      sheet.addRow(['Asignaciones', report.stats.totalAssignments]);
      sheet.addRow(['Completadas', report.stats.completedAssignments]);
      sheet.addRow(['Tasa de finalización', report.stats.completionRate]);
      sheet.addRow(['Certificados', report.stats.certificates]);
      sheet.addRow(['Progreso promedio', report.stats.averageProgress]);
    } else if ('user' in report) {
      sheet.addRow(['ID usuario', report.user.id]);
      sheet.addRow(['Nombre', report.user.name]);
      sheet.addRow(['Email', report.user.email]);
      sheet.addRow([]);
      sheet.addRow(['Cursos inscritos', report.stats.enrolledCourses]);
      sheet.addRow(['Cursos completados', report.stats.completedCourses]);
      sheet.addRow(['En progreso', report.stats.inProgressCourses]);
      sheet.addRow(['Certificados', report.stats.certificates]);
      sheet.addRow([]);
      sheet.addRow(['Cursos']);
      sheet.addRow(['ID', 'Título', 'Estado', 'Progreso']);
      report.courses.forEach((course) => {
        sheet.addRow([course.id, course.title, course.status, course.progress]);
      });
    }

    const buffer = (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
    return Buffer.from(buffer);
  }
}
