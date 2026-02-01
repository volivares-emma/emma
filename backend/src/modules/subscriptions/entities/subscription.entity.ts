import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  UNSUBSCRIBED = 'unsubscribed',
}

export enum SubscriptionType {
  GENERAL = 'general',
  CAREER = 'career',
  BLOG = 'blog',
}

@Entity('tbl_subscriptions')
@Index('IDX_tbl_subscriptions_status_type', ['status', 'type'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 180 })
  email: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.GENERAL,
  })
  type: SubscriptionType;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'varchar', length: 160, nullable: true })
  source: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  subscribed_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  unsubscribed_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
