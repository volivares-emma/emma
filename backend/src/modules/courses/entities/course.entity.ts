import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CourseMaterial } from './course-material.entity';
import { CourseAssignment } from './course-assignment.entity';
import { CourseProgress } from './course-progress.entity';
import { Certificate } from './certificate.entity';

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  INACTIVE = 'inactive',
}

@Entity('tbl_courses')
@Index('courses_status_active_idx', ['status', 'is_active'])
@Index('courses_creator_idx', ['created_by'])
@Index('courses_category_idx', ['category'])
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'int', nullable: true, default: 0 })
  duration_hours: number | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  instructor: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  meeting_link: string | null;

  @Column({ type: 'int', nullable: true, default: 0 })
  max_students: number | null;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  created_by: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;

  @OneToMany(() => CourseAssignment, (assignment) => assignment.course)
  assignments: CourseAssignment[];

  @OneToMany(() => CourseMaterial, (material) => material.course)
  materials: CourseMaterial[];

  @OneToMany(() => CourseProgress, (progress) => progress.course)
  progresses: CourseProgress[];

  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];
}
