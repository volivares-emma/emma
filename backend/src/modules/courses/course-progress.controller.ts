import {
  Controller,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CourseProgressService } from './course-progress.service';
import { UpdateCourseProgressDto } from './dto/update-course-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class CourseProgressController {
  constructor(private readonly progressService: CourseProgressService) {}

  private getUserId(req: ExpressRequest): number | undefined {
    return (req as ExpressRequest & { user?: { id?: number } }).user?.id;
  }

  private getUserRole(req: ExpressRequest): string | undefined {
    return (req as ExpressRequest & { user?: { role?: string } }).user?.role;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseProgressDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = this.getUserId(req);
    if (userId === undefined) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.progressService.updateProgress(
      +id,
      updateDto,
      userId,
      this.getUserRole(req) ?? 'guest',
    );
  }
}
