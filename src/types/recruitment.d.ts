import { JsonValue } from "@prisma/client/runtime/library";
import { JobPosition } from "./job-position";
import type { File } from "./file";

export interface Recruitment {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  position: string;
  experience?: string | null;
  salaryExpectation?: string | null;
  coverLetter?: string | null;
  status: "new" | "reviewing" | "interview" | "hired" | "rejected";
  positionId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  files?: File[];
  jobPositionRef?: JobPosition | null;
}

export interface RecruitmentListResponse {
  data: Recruitment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RecruitmentCreatePayload {
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience?: string;
  salaryExpectation?: string;
  coverLetter?: string;
  status?: "new" | "reviewing" | "interview" | "hired" | "rejected";
  positionId?: number;
}

export interface RecruitmentUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: string;
  salaryExpectation?: string;
  coverLetter?: string;
  status?: "new" | "reviewing" | "interview" | "hired" | "rejected";
  positionId?: number;
}

export type RecruitmentResponse = Recruitment;
