export interface JobPosition {
  id: number;
  title: string;
  description?: string | null;
  department?: string | null;
  location: string;
  employment_type: string;
  salary_min?: number | null;
  salary_max?: number | null;
  requirements:  JsonValue;
  responsibilities:  JsonValue;
  experience_min: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface JobPositionListResponse {
  data: JobPosition[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JobPositionCreatePayload {
  title: string;
  description: string;
  department?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  requirements?:  JsonValue;
  responsibilities?:  JsonValue;
  experience_min?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface JobPositionUpdatePayload {
  id: number;
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  requirements?:  JsonValue;
  responsibilities?: JsonValue;
  experience_min?: number;
  is_active?: boolean;
  is_featured?: boolean;
}


export type JobPositionsResponse = JobPosition;
