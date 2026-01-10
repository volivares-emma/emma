import type { User } from "./user";

interface BlogFile {
  id: number;
  filename: string;
  path: string;
  related_type: string;
  related_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: number;
  title: string;
  description?: string | null;
  content: string;
  authorId: number;
  author?: User; // Relación opcional con User
  slug: string;
  status: "draft" | "published" | "archived";
  pubDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
  authorId: number;
  slug: string;
  status: "draft" | "published" | "archived";
  pubDate: string; // ISO string para el formulario
}

export interface BlogUpdatePayload {
  title?: string;
  content?: string;
  description?: string;
  authorId?: number;
  slug?: string;
  status?: "draft" | "published" | "archived";
  pubDate?: string;
}

export type BlogResponse = Blog;
