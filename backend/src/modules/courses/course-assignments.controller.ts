import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CourseAssignmentsService } from './course-assignments.service';
import { CreateCourseAssignmentDto } from './dto/create-course-assignment.dto';
import { UpdateCourseAssignmentDto } from './dto/update-course-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class CourseAssignmentsController {
  constructor(
    private readonly courseAssignmentsService: CourseAssignmentsService,
  ) {}

  private getUserId(req: ExpressRequest): number | undefined {
    return (req as ExpressRequest & { user?: { id?: number } }).user?.id;
  }

  private getUserRole(req: ExpressRequest): string | undefined {
    return (req as ExpressRequest & { user?: { role?: string } }).user?.role;
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createDto: CreateCourseAssignmentDto,
    @Request() req: ExpressRequest,
  ) {
    return this.courseAssignmentsService.create(createDto, this.getUserId(req));
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('pageSize') pageSize?: string,
    @Query('course_id') courseId?: string,
    @Query('user_id') userId?: string,
    @Query('status') status?: string,
    @Request() req?: ExpressRequest,
  ) {
    return this.courseAssignmentsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : pageSize ? parseInt(pageSize) : 10,
      courseId: courseId ? parseInt(courseId) : undefined,
      userId: userId ? parseInt(userId) : undefined,
      status,
      currentUserId: req ? this.getUserId(req) : undefined,
      userRole: req ? this.getUserRole(req) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: ExpressRequest) {
    return this.courseAssignmentsService.findOne(
      +id,
      this.getUserId(req),
      this.getUserRole(req),
    );
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseAssignmentDto,
  ) {
    return this.courseAssignmentsService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.courseAssignmentsService.remove(+id);
  }
}
