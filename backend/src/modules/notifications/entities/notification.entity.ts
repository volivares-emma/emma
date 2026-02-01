import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum NotificationType {
  SYSTEM = 'system',
  NEWS = 'news',
  EVENT = 'event',
  PROMOTION = 'promotion',
  WARNING = 'warning',
}

export enum NotificationShowOnPages {
  ALL = 'all',
  HOME = 'home',
  SPECIFIC = 'specific',
}

@Entity('tbl_notifications')
@Index('notifications_active_type_idx', ['is_active', 'notification_type'])
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  notification_type: NotificationType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  action_url: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  action_text: string | null;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: true })
  dismissible: boolean;

  @Column({
    type: 'enum',
    enum: NotificationShowOnPages,
    default: NotificationShowOnPages.ALL,
  })
  show_on_pages: NotificationShowOnPages;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
