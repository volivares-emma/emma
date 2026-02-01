import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CourseAssignment } from './entities/course-assignment.entity';
import { AssignmentStatus } from './entities/assignment-status.enum';
import { CreateCourseAssignmentDto } from './dto/create-course-assignment.dto';
import { UpdateCourseAssignmentDto } from './dto/update-course-assignment.dto';

@Injectable()
export class CourseAssignmentsService {
  constructor(
    @InjectRepository(CourseAssignment)
    private readonly assignmentRepository: Repository<CourseAssignment>,
  ) {}

  async create(
    createAssignmentDto: CreateCourseAssignmentDto,
    assignedBy?: number,
  ): Promise<CourseAssignment | CourseAssignment[]> {
    const { name, user_id, user_ids, course_id, status, due_date, notes } =
      createAssignmentDto;

    if (assignedBy === undefined) {
      throw new BadRequestException({
        message: 'Usuario asignador requerido',
      });
    }

    const assignedByValue: number = assignedBy;

    const userIds: number[] = Array.isArray(user_ids)
      ? user_ids.filter((id): id is number => typeof id === 'number')
      : [];
    const singleUserId = typeof user_id === 'number' ? user_id : undefined;
    const safeName =
      typeof name === 'string' && name.trim()
        ? name
        : `Asignación curso ${course_id}`;
    const safeStatus = Object.values(AssignmentStatus).includes(
      status as AssignmentStatus,
    )
      ? (status as AssignmentStatus)
      : undefined;
    const dueDateValue: Date | null =
      typeof due_date === 'string' ? new Date(String(due_date)) : null;
    const notesValue: string | null = typeof notes === 'string' ? notes : null;

    if (userIds.length === 0 && singleUserId === undefined) {
      throw new BadRequestException({
        message: 'Debe enviar user_id o user_ids',
      });
    }

    if (userIds.length > 0) {
      const existing = await this.assignmentRepository.find({
        where: {
          course_id,
          user_id: In(userIds),
        },
        select: ['user_id'],
      });

      if (existing.length > 0) {
        const existingIds = existing.map((a) => a.user_id);
        throw new BadRequestException({
          message: 'Los usuarios ya tienen asignación en este curso',
          user_ids: existingIds,
        });
      }
    } else if (singleUserId !== undefined) {
      const existing = await this.assignmentRepository.findOne({
        where: {
          course_id,
          user_id: singleUserId,
        },
        select: ['id'],
      });

      if (existing) {
        throw new BadRequestException({
          message: 'El usuario ya tiene asignación en este curso',
          user_id: singleUserId,
        });
      }
    }

    if (userIds.length > 0) {
      const assignments = userIds.map((id) => {
        const payload: Partial<CourseAssignment> = {
          name: safeName,
          course_id,
          user_id: id,
          status: safeStatus,
          due_date: dueDateValue,
          notes: notesValue,
          assigned_by: assignedByValue,
          group_id: null,
        };
        return this.assignmentRepository.create(payload);
      });
      return await this.assignmentRepository.save(assignments);
    }

    if (singleUserId === undefined) {
      throw new BadRequestException({
        message: 'Debe enviar user_id',
      });
    }

    const payload: Partial<CourseAssignment> = {
      name: safeName,
      course_id,
      user_id: singleUserId,
      status: safeStatus,
      due_date: dueDateValue,
      notes: notesValue,
      assigned_by: assignedByValue,
      group_id: null,
    };
    const assignment = this.assignmentRepository.create(payload);
    return await this.assignmentRepository.save(assignment);
  }

  async findAll(params: {
    page: number;
    limit: number;
    courseId?: number;
    userId?: number;
    status?: string;
    currentUserId?: number;
    userRole?: string;
  }): Promise<{
    data: CourseAssignment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, courseId, userId, status, currentUserId, userRole } =
      params;
    const where: Record<string, unknown> = {};

    // Filtros según rol
    if (userRole === 'editor' && currentUserId !== undefined) {
      where.OR = [
        { course: { created_by: currentUserId } },
        { user: { created_by: currentUserId } },
      ];
    }

    if (userRole === 'guest' && currentUserId !== undefined) {
      where.user_id = currentUserId;
    }

    if (courseId) {
      where.course_id = courseId;
    }

    if (userId) {
      where.user_id = userId;
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.assignmentRepository.findAndCount({
      where,
      relations: ['user', 'course', 'progress'],
      skip: (page - 1) * limit,
      take: limit,
      order: { assigned_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findByUser(userId: number): Promise<CourseAssignment[]> {
    return await this.assignmentRepository.find({
      where: { user_id: userId },
      relations: ['course', 'user'],
      order: { assigned_at: 'DESC' },
    });
  }

  async findByCourse(courseId: number): Promise<CourseAssignment[]> {
    return await this.assignmentRepository.find({
      where: { course_id: courseId },
      relations: ['user'],
      order: { assigned_at: 'DESC' },
    });
  }

  async findOne(
    id: number,
    currentUserId?: number,
    userRole?: string,
  ): Promise<CourseAssignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['user', 'course', 'progress'],
    });
    if (!assignment) {
      throw new NotFoundException(`CourseAssignment with ID ${id} not found`);
    }

    // Verificar permisos
    if (userRole === 'editor') {
      if (
        assignment.course.created_by !== currentUserId &&
        assignment.user.created_by !== currentUserId
      ) {
        throw new Error('Insufficient permissions');
      }
    }

    if (userRole === 'guest' && assignment.user_id !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    return assignment;
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateCourseAssignmentDto,
  ): Promise<CourseAssignment> {
    const assignment = await this.findOne(id);
    const { due_date, notes, name, course_id, user_id, status } =
      updateAssignmentDto;
    const normalizedDueDate =
      due_date !== undefined
        ? due_date
          ? new Date(String(due_date))
          : null
        : undefined;
    const normalizedNotes: string | undefined =
      typeof notes === 'string'
        ? notes
        : notes === undefined
          ? undefined
          : String(notes);
    const safeStatus = Object.values(AssignmentStatus).includes(
      status as AssignmentStatus,
    )
      ? (status as AssignmentStatus)
      : undefined;

    if (typeof name === 'string') assignment.name = name;
    if (typeof course_id === 'number') assignment.course_id = course_id;
    if (typeof user_id === 'number') assignment.user_id = user_id;
    if (safeStatus !== undefined) assignment.status = safeStatus;
    if (normalizedDueDate !== undefined)
      assignment.due_date = normalizedDueDate;
    if (normalizedNotes !== undefined) assignment.notes = normalizedNotes;
    return await this.assignmentRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }
}
