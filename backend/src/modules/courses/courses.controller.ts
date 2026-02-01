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
  UnauthorizedException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CoursesService } from './courses.service';
import { CourseMaterialsService } from './course-materials.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly materialsService: CourseMaterialsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Request() req: ExpressRequest,
  ) {
    const createdBy = (req as ExpressRequest & { user?: { id?: number } }).user
      ?.id;
    if (createdBy === undefined) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.coursesService.create({
      ...createCourseDto,
      created_by: createdBy,
    });
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.coursesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('published')
  findPublished() {
    return this.coursesService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id/materials')
  getMaterials(@Param('id') id: string) {
    return this.materialsService.findByCourse(+id);
  }
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
