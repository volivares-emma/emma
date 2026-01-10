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
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
  subscribedAt?: Date | null;
  unsubscribedAt?: Date | null;
}

export type SubscriptionResponse = Subscription;
