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
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';

@Entity('tbl_certificates')
@Index('certificates_code_idx', ['certificate_code'])
@Index('certificates_issued_idx', ['issued_at'])
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  course_id: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  certificate_code: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  issued_at: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_path: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  template_used: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.certificates, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
