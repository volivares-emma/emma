import { JsonValue } from "@prisma/client/runtime/library";

export type SubscriptionStatus = 'active' | 'unsubscribed';
export type SubscriptionType = 'general' | 'career' | 'blog';

export interface Subscription {
  id: number;
  email: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  source: string | null;
  metadata?: JsonValue | null;
  subscribed_at: Date;
  unsubscribed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionListResponse {
  data: Subscription[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubscriptionCreatePayload {
  email: string;
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  source?: string | null;
  metadata?: JsonValue | null;
}

export interface SubscriptionUpdatePayload {
  email?: string;
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  source?: string | null;
  subscribed_at?: Date | null;
  unsubscribed_at?: Date | null;
}

export type SubscriptionResponse = Subscription;
