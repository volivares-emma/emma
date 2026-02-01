import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Recruitment } from '../../recruitments/entities/recruitment.entity';

@Entity('tbl_job_positions')
@Index('job_positions_flags_idx', ['is_active', 'is_featured'])
export class JobPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  department: string | null;

  @Column({ type: 'varchar', length: 120, default: 'Remoto' })
  location: string;

  @Column({ type: 'varchar', length: 120, default: 'Tiempo completo' })
  employment_type: string;

  @Column({ type: 'int', nullable: true })
  salary_min: number | null;

  @Column({ type: 'int', nullable: true })
  salary_max: number | null;

  @Column({ type: 'jsonb', nullable: true })
  requirements: any;

  @Column({ type: 'jsonb', nullable: true })
  responsibilities: any;

  @Column({ type: 'int', default: 0 })
  experience_min: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_featured: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;

  @OneToMany(() => Recruitment, (recruitment) => recruitment.job_position)
  recruitments: Recruitment[];
}
