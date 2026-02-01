import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum SlideVisualType {
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  TEAM = 'team',
  GROWTH = 'growth',
  INNOVATION = 'innovation',
  IMAGE = 'image',
}

@Entity('tbl_slides')
@Index('slides_active_sort_idx', ['is_active', 'sort_order'])
export class Slide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'varchar', length: 220, nullable: true })
  subtitle: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 120, default: 'Conoce más' })
  button_text: string;

  @Column({ type: 'varchar', length: 300, default: '/about' })
  button_link: string;

  @Column({
    type: 'enum',
    enum: SlideVisualType,
    default: SlideVisualType.DASHBOARD,
  })
  visual_type: SlideVisualType;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
