import { JsonValue } from "@prisma/client/runtime/library";
import { JobPosition } from "./job-positions";
import type { File } from "./file";

export interface Recruitment {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  position: string;
  experience?: string | null;
  salary_expectation?: string | null;
  cover_letter?: string | null;
  status: "new" | "reviewing" | "interview" | "hired" | "rejected";
  position_id?: number | null;
  created_at: Date;
  updated_at: Date;
  files?: File[];
  job_position?: JobPosition | null;
}

export interface RecruitmentListResponse {
  data: Recruitment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RecruitmentCreatePayload {
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  experience?: string;
  salary_expectation?: string;
  cover_letter?: string;
  status?: "new" | "reviewing" | "interview" | "hired" | "rejected";
  position_id?: number;
}

export interface RecruitmentUpdatePayload {
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: string;
  salary_expectation?: string;
  cover_letter?: string;
  status?: "new" | "reviewing" | "interview" | "hired" | "rejected";
  position_id?: number;
}

export type RecruitmentResponse = Recruitment;
