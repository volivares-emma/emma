import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ReportsService,
  CourseReportData,
  UserReportData,
  GlobalReportData,
} from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  private readonly reportsService: ReportsService;

  constructor(reportsService: ReportsService) {
    this.reportsService = reportsService;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.READER)
  async generateReport(
    @Query('type') type: 'course' | 'user' | 'global',
    @Query('course_id') courseId?: string,
    @Query('user_id') userId?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('format') format?: 'pdf' | 'excel',
    @Request() req?: { user: { userId: number; role: string } },
    @Res({ passthrough: true }) res?: Response,
  ): Promise<
    StreamableFile | CourseReportData | UserReportData | GlobalReportData
  > {
    type ReportServiceContract = {
      generateReportFile: (
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
      ) => Promise<{ buffer: Buffer; contentType: string; fileName: string }>;
      generateReport: (params: {
        type: 'course' | 'user' | 'global';
        courseId?: number;
        userId?: number;
        startDate?: string;
        endDate?: string;
        currentUserId: number;
        userRole: string;
      }) => Promise<CourseReportData | UserReportData | GlobalReportData>;
    };
    const params: {
      type: 'course' | 'user' | 'global';
      courseId?: number;
      userId?: number;
      startDate?: string;
      endDate?: string;
      currentUserId: number;
      userRole: string;
    } = {
      type,
      courseId: courseId ? parseInt(courseId) : undefined,
      userId: userId ? parseInt(userId) : undefined,
      startDate,
      endDate,
      currentUserId: req?.user?.userId ?? 0,
      userRole: req?.user?.role ?? '',
    };

    const reportsService: ReportServiceContract = this.reportsService;

    if (format === 'pdf' || format === 'excel') {
      const { buffer, contentType, fileName } =
        await reportsService.generateReportFile(params, format);
      if (res) {
        res.setHeader('Content-Type', contentType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${fileName}"`,
        );
      }
      return new StreamableFile(buffer);
    }

    return reportsService.generateReport(params);
  }
}
