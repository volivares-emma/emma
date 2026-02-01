import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';

export enum MaterialType {
  PDF = 'pdf',
  VIDEO = 'video',
  LINK = 'link',
  DOCUMENT = 'document',
  PRESENTATION = 'presentation',
}

@Entity('tbl_course_materials')
@Index('materials_course_order_idx', ['course_id', 'sort_order'])
export class CourseMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @Column({ type: 'varchar', length: 220 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_path: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url: string | null;

  @Column({
    type: 'enum',
    enum: MaterialType,
  })
  material_type: MaterialType;

  @Column({ type: 'int', nullable: true, default: 0 })
  file_size: number | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ default: false })
  is_required: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Course, (course) => course.materials, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
