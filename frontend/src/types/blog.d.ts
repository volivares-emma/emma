import type { User } from "./user";

interface BlogFile {
  id: number;
  filename: string;
  path: string;
  related_type: string;
  related_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Blog {
  id: number;
  title: string;
  description?: string | null;
  content: string;
  author_id: number;
  author?: User; // Relación opcional con User
  slug: string;
  status: "draft" | "published" | "archived";
  pub_date: Date;
  created_at: Date;
  updated_at: Date;
  files?: BlogFile[]; // Archivos asociados al blog
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlogCreatePayload {
  title: string;
  description?: string;
  content: string;
  author_id: number;
  slug: string;
  status: "draft" | "published" | "archived";
  pub_date: string; // ISO string para el formulario
}

export interface BlogUpdatePayload {
  title?: string;
  content?: string;
  description?: string;
  author_id?: number;
  slug?: string;
  status?: "draft" | "published" | "archived";
  pub_date?: string;
}

export type BlogResponse = Blog;
