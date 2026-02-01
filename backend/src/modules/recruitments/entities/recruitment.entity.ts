import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { JobPosition } from '../../jobs-positions/entities/job-position.entity';

export enum RecruitmentStatus {
  NEW = 'new',
  REVIEWING = 'reviewing',
  INTERVIEW = 'interview',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

@Entity('tbl_recruitments')
@Index('recruitments_position_idx', ['position_id'])
@Index('recruitments_status_created_idx', ['status', 'created_at'])
export class Recruitment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 160 })
  full_name: string;

  @Column({ type: 'varchar', length: 180 })
  email: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 160 })
  position: string;

  @Column({ type: 'text', nullable: true })
  experience: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  salary_expectation: string | null;

  @Column({ type: 'text', nullable: true })
  cover_letter: string | null;

  @Column({
    type: 'enum',
    enum: RecruitmentStatus,
    default: RecruitmentStatus.NEW,
  })
  status: RecruitmentStatus;

  @Column({ nullable: true })
  position_id: number | null;

  @ManyToOne(() => JobPosition, (position) => position.recruitments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'position_id' })
  job_position: JobPosition;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
