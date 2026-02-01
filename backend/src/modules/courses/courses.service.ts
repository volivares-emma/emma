import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Course, CourseStatus } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Course[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.courseRepository.findAndCount({
      where: { deleted_at: IsNull() },
      relations: ['creator', 'materials', 'assignments'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findPublished(): Promise<Course[]> {
    return await this.courseRepository.find({
      where: {
        status: CourseStatus.PUBLISHED,
        is_active: true,
        deleted_at: IsNull(),
      },
      relations: ['creator'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['creator', 'materials', 'assignments', 'progresses'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.courseRepository.softDelete(id);
  }
}
