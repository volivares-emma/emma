import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CourseAssignmentGroupsService } from './course-assignment-groups.service';
import { CreateCourseAssignmentGroupDto } from './dto/create-course-assignment-group.dto';
import { UpdateCourseAssignmentGroupDto } from './dto/update-course-assignment-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('assignment-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseAssignmentGroupsController {
  constructor(private readonly groupsService: CourseAssignmentGroupsService) {}

  private getUserId(req: ExpressRequest): number | undefined {
    return (req as ExpressRequest & { user?: { id?: number } }).user?.id;
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() dto: CreateCourseAssignmentGroupDto,
    @Request() req: ExpressRequest,
  ) {
    return this.groupsService.create(dto, this.getUserId(req));
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.READER)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.groupsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.READER)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateCourseAssignmentGroupDto) {
    return this.groupsService.update(+id, dto);
  }

  @Post(':id/users')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  addUsers(
    @Param('id') id: string,
    @Body() body: { user_ids: number[] },
    @Request() req: ExpressRequest,
  ) {
    return this.groupsService.addUsers(+id, body.user_ids, this.getUserId(req));
  }

  @Delete(':id/users/:userId')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeUser(+id, +userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
