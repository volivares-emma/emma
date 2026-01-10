export interface JobPosition {
  id: number;
  title: string;
  description?: string | null;
  department?: string | null;
  location: string;
  employmentType: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  requirements:  JsonValue;
  responsibilities:  JsonValue;
  experienceMin: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  requirements?:  JsonValue;
  responsibilities?:  JsonValue;
  experienceMin?: number;
}

export interface JobPositionUpdatePayload {
  id: number;
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  requirements?:  JsonValue;
  responsibilities?: JsonValue;
  experienceMin?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}


export type JobPositionsResponse = JobPosition;
