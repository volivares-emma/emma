import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from '../../users/entities/user.entity';
import { CourseProgress } from './course-progress.entity';
import { CourseAssignmentGroup } from './course-assignment-group.entity';
import { AssignmentStatus } from './assignment-status.enum';

@Entity('tbl_course_assignments')
@Index('assignments_user_status_idx', ['user_id', 'status'])
@Index('assignments_course_status_idx', ['course_id', 'status'])
@Index('assignments_assigned_by_idx', ['assigned_by'])
export class CourseAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column()
  course_id: number;

  @Column()
  user_id: number;

  @Column()
  assigned_by: number;

  @Column({ nullable: true })
  group_id: number | null;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  assigned_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  started_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Course, (course) => course.assignments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CourseAssignmentGroup, (group) => group.assignments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'group_id' })
  group: CourseAssignmentGroup;

  @OneToOne(() => CourseProgress, (progress) => progress.assignment)
  progress: CourseProgress;
}
