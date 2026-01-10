export interface Notification {
  id: number;
  title: string;
  description: string;
  notificationType: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  actionUrl?: string;
  actionText?: string;
  isActive?: boolean;
  dismissible?: boolean;
  showOnPages: 'all' | 'home' | 'specific';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NotificationCreatePayload {
  title: string;
  description: string;
  notificationType: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  actionUrl?: string;
  actionText?: string;
  isActive?: boolean;
  dismissible?: boolean;
  showOnPages: 'all' | 'home' | 'specific';
}

export interface NotificationUpdatePayload {
  title?: string;
  description?: string;
  notificationType?: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  actionUrl?: string;
  actionText?: string;
  isActive?: boolean;
  dismissible?: boolean;
  showOnPages?: 'all' | 'home' | 'specific';
}

export type NotificationResponse = Notification[];
