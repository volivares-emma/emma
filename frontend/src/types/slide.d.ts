
import type { File } from "./file";

export interface Slide {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  button_text?: string;
  button_link?: string;
  visual_type?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  is_active?: boolean;
  sort_order?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
  files?: File[];
}

export interface SlideListResponse {
  data: Slide[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SlideCreatePayload {
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  visual_type?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  is_active?: boolean;
  sort_order?: number;
}

export interface SlideUpdatePayload {
  title?: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  visual_type?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  is_active?: boolean;
  sort_order?: number;
}

export type SlideResponse = Slide;