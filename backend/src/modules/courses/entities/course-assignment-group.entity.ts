import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Course } from './course.entity';
import { CourseAssignment } from './course-assignment.entity';
import { AssignmentStatus } from './assignment-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('tbl_course_assignment_groups')
@Index('assignment_groups_course_idx', ['course_id'])
@Index('assignment_groups_creator_idx', ['created_by'])
export class CourseAssignmentGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column()
  course_id: number;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column()
  created_by: number;

  @ManyToOne(() => Course, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => CourseAssignment, (assignment) => assignment.group)
  assignments: CourseAssignment[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
