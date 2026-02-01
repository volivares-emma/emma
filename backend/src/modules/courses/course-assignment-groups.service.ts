import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CourseAssignmentGroup } from './entities/course-assignment-group.entity';
import { CourseAssignment } from './entities/course-assignment.entity';
import { CourseProgress } from './entities/course-progress.entity';
import { CreateCourseAssignmentGroupDto } from './dto/create-course-assignment-group.dto';
import { UpdateCourseAssignmentGroupDto } from './dto/update-course-assignment-group.dto';

@Injectable()
export class CourseAssignmentGroupsService {
  constructor(
    @InjectRepository(CourseAssignmentGroup)
    private readonly groupRepository: Repository<CourseAssignmentGroup>,
    @InjectRepository(CourseAssignment)
    private readonly assignmentRepository: Repository<CourseAssignment>,
    @InjectRepository(CourseProgress)
    private readonly progressRepository: Repository<CourseProgress>,
  ) {}

  async create(
    dto: CreateCourseAssignmentGroupDto,
    createdBy?: number,
  ): Promise<CourseAssignmentGroup> {
    const { user_ids, course_id, due_date, notes, status, name } = dto;

    const existing = await this.assignmentRepository.find({
      where: {
        course_id,
        user_id: In(user_ids),
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

    const group = this.groupRepository.create({
      name,
      course_id,
      due_date: due_date ? new Date(due_date) : null,
      notes: notes ?? null,
      status,
      created_by: createdBy,
    });

    const savedGroup = await this.groupRepository.save(group);

    const assignments = user_ids.map((id) =>
      this.assignmentRepository.create({
        course_id,
        user_id: id,
        status,
        due_date: due_date ? new Date(due_date) : null,
        notes: notes ?? null,
        assigned_by: createdBy,
        group_id: savedGroup.id,
      }),
    );

    await this.assignmentRepository.save(assignments);

    return this.findOne(savedGroup.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: CourseAssignmentGroup[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.groupRepository.findAndCount({
      relations: ['course', 'assignments', 'assignments.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<CourseAssignmentGroup> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['course', 'assignments', 'assignments.user'],
    });

    if (!group) {
      throw new NotFoundException(`Assignment group with ID ${id} not found`);
    }

    return group;
  }

  async update(
    id: number,
    dto: UpdateCourseAssignmentGroupDto,
  ): Promise<CourseAssignmentGroup> {
    const group = await this.findOne(id);

    const { due_date, notes, status, ...rest } = dto;
    const normalizedDueDate =
      due_date !== undefined
        ? due_date
          ? new Date(due_date)
          : null
        : undefined;
    const normalizedNotes = notes !== undefined ? notes : undefined;
    const normalizedStatus = status !== undefined ? status : undefined;

    Object.assign(group, rest, {
      ...(normalizedDueDate !== undefined
        ? { due_date: normalizedDueDate }
        : {}),
      ...(normalizedNotes !== undefined ? { notes: normalizedNotes } : {}),
      ...(normalizedStatus !== undefined ? { status: normalizedStatus } : {}),
    });

    await this.groupRepository.save(group);

    if (
      normalizedDueDate !== undefined ||
      normalizedNotes !== undefined ||
      normalizedStatus !== undefined
    ) {
      await this.assignmentRepository.update(
        { group_id: id },
        {
          ...(normalizedDueDate !== undefined
            ? { due_date: normalizedDueDate }
            : {}),
          ...(normalizedNotes !== undefined ? { notes: normalizedNotes } : {}),
          ...(normalizedStatus !== undefined
            ? { status: normalizedStatus }
            : {}),
        },
      );
    }

    return this.findOne(id);
  }

  async addUsers(
    id: number,
    userIds: number[],
    assignedBy?: number,
  ): Promise<CourseAssignmentGroup> {
    const group = await this.findOne(id);

    const existing = await this.assignmentRepository.find({
      where: {
        course_id: group.course_id,
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

    const assignments = userIds.map((userId) =>
      this.assignmentRepository.create({
        course_id: group.course_id,
        user_id: userId,
        status: group.status,
        due_date: group.due_date,
        notes: group.notes,
        assigned_by: assignedBy,
        group_id: group.id,
      }),
    );

    await this.assignmentRepository.save(assignments);
    return this.findOne(id);
  }

  async removeUser(id: number, userId: number): Promise<void> {
    const group = await this.findOne(id);
    const assignment = await this.assignmentRepository.findOne({
      where: { group_id: group.id, user_id: userId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found for this user');
    }

    await this.progressRepository.delete({ assignment_id: assignment.id });
    await this.assignmentRepository.remove(assignment);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    const assignments = await this.assignmentRepository.find({
      where: { group_id: id },
      select: ['id'],
    });
    const assignmentIds = assignments.map((assignment) => assignment.id);

    if (assignmentIds.length > 0) {
      await this.progressRepository.delete({
        assignment_id: In(assignmentIds),
      });
    }

    await this.assignmentRepository.delete({ group_id: id });
    await this.groupRepository.delete(id);
  }
}
