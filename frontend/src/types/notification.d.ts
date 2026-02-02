export interface Notification {
  id: number;
  title: string;
  description: string;
  notification_type: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  action_url?: string | null;
  action_text?: string | null;
  is_active?: boolean;
  dismissible?: boolean;
  show_on_pages: 'all' | 'home' | 'specific';
  created_at: string;
  updated_at: string;
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
  notification_type: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  action_url?: string | null;
  action_text?: string | null;
  is_active?: boolean;
  dismissible?: boolean;
  show_on_pages: 'all' | 'home' | 'specific';
}

export interface NotificationUpdatePayload {
  title?: string;
  description?: string;
  notification_type?: 'system' | 'news' | 'event' | 'promotion' | 'warning';
  action_url?: string | null;
  action_text?: string | null;
  is_active?: boolean;
  dismissible?: boolean;
  show_on_pages?: 'all' | 'home' | 'specific';
}

export type NotificationResponse = Notification[];
