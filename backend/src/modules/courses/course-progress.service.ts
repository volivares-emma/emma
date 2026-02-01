import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseProgress } from './entities/course-progress.entity';
import { CourseAssignment } from './entities/course-assignment.entity';
import { CreateCourseProgressDto } from './dto/create-course-progress.dto';
import { UpdateCourseProgressDto } from './dto/update-course-progress.dto';

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectRepository(CourseProgress)
    private readonly progressRepository: Repository<CourseProgress>,
    @InjectRepository(CourseAssignment)
    private readonly assignmentRepository: Repository<CourseAssignment>,
  ) {}

  async create(
    createProgressDto: CreateCourseProgressDto,
  ): Promise<CourseProgress> {
    const progress = this.progressRepository.create(createProgressDto);
    return await this.progressRepository.save(progress);
  }

  async findByUserAndCourse(
    userId: number,
    courseId: number,
  ): Promise<CourseProgress[]> {
    return await this.progressRepository.find({
      where: { user_id: userId, course_id: courseId },
      relations: ['material'],
      order: { last_accessed_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CourseProgress> {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['user', 'course', 'material'],
    });
    if (!progress) {
      throw new NotFoundException(`CourseProgress with ID ${id} not found`);
    }
    return progress;
  }

  async update(
    id: number,
    updateProgressDto: UpdateCourseProgressDto,
  ): Promise<CourseProgress> {
    const progress = await this.findOne(id);
    Object.assign(progress, updateProgressDto);
    progress.last_accessed_at = new Date();
    return await this.progressRepository.save(progress);
  }

  async remove(id: number): Promise<void> {
    const progress = await this.findOne(id);
    await this.progressRepository.remove(progress);
  }

  async updateProgress(
    assignmentId: number,
    updateDto: UpdateCourseProgressDto,
    currentUserId: number,
    userRole: string,
  ): Promise<CourseProgress> {
    // Verificar que la asignación existe
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['progress', 'course', 'user'],
    });

    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID ${assignmentId} not found`,
      );
    }

    // Verificar permisos
    if (userRole === 'guest' && assignment.user_id !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    if (userRole === 'editor') {
      if (
        assignment.user_id !== currentUserId &&
        assignment.course.created_by !== currentUserId &&
        assignment.user.created_by !== currentUserId
      ) {
        throw new Error('Insufficient permissions');
      }
    }

    // Actualizar o crear progress
    const { notes, completion_notes, ...rest } = updateDto;
    const normalizedNotes =
      typeof notes === 'string'
        ? notes
        : notes === undefined
          ? undefined
          : String(notes);
    const normalizedCompletionNotes =
      typeof completion_notes === 'string'
        ? completion_notes
        : completion_notes === undefined
          ? undefined
          : String(completion_notes);
    const normalizedUpdate: UpdateCourseProgressDto = {
      ...rest,
      ...(normalizedNotes && !normalizedCompletionNotes
        ? { completion_notes: normalizedNotes }
        : {}),
      ...(normalizedCompletionNotes
        ? { completion_notes: normalizedCompletionNotes }
        : {}),
    };

    let progress = assignment.progress;
    if (!progress) {
      progress = this.progressRepository.create({
        assignment_id: assignmentId,
        user_id: assignment.user_id,
        course_id: assignment.course_id,
        ...normalizedUpdate,
      });
    } else {
      Object.assign(progress, normalizedUpdate);
    }

    progress.last_accessed_at = new Date();
    return await this.progressRepository.save(progress);
  }
}
