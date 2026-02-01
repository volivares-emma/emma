
import type { File } from "./file";

export interface Slide {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string;
  button_text?: string;
  buttonLink?: string;
  button_link?: string;
  visualType?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  visual_type?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  isActive?: boolean;
  is_active?: boolean;
  sortOrder?: number;
  sort_order?: number;
  createdAt?: Date | string;
  created_at?: Date | string;
  updatedAt?: Date | string;
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
  buttonText?: string;
  buttonLink?: string;
  visualType?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  isActive?: boolean;
  sortOrder?: number;
}

export interface SlideUpdatePayload {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  visualType?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation' | 'image';
  isActive?: boolean;
  sortOrder?: number;
}

export type SlideResponse = Slide;