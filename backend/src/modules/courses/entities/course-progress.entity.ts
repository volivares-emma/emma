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
import { CourseAssignment } from './course-assignment.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';

@Entity('tbl_course_progresses')
@Index('progress_user_course_idx', ['user_id', 'course_id'])
export class CourseProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  assignment_id: number;

  @Column()
  user_id: number;

  @Column()
  course_id: number;

  @Column({ type: 'int', default: 0 })
  progress_percentage: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  current_module: string | null;

  @Column({ type: 'int', default: 0 })
  time_spent_minutes: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_accessed_at: Date | null;

  @Column({ type: 'text', nullable: true })
  completion_notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToOne(() => CourseAssignment, (assignment) => assignment.progress, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: CourseAssignment;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.progresses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
