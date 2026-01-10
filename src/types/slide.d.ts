
import type { File } from "./file";

export interface Slide {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  buttonText: string;
  buttonLink: string;
  visualType: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation';
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
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
  visualType?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation';
  isActive?: boolean;
  sortOrder?: number;
}

export interface SlideUpdatePayload {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  visualType?: 'dashboard' | 'analytics' | 'team' | 'growth' | 'innovation';
  isActive?: boolean;
  sortOrder?: number;
}

export type SlideResponse = Slide;