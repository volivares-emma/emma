import type { File } from "./file";

export interface User {
  id: number;
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'editor' | 'guest' | 'reader';
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  files?: File[];
}

export interface CreateUserDto {
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'editor' | 'guest' | 'reader';
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_by?: number;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'editor' | 'guest' | 'reader';
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
}

export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'guest' | 'reader';
  is_active: boolean;
  created_at: Date;
}

export interface UserWithStats extends User {
  stats?: {
    total_courses_assigned: number;
    total_courses_completed: number;
    total_certificates: number;
    completion_rate: number;
  };
  creator?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface UserFilters {
  role?: 'admin' | 'editor' | 'guest' | 'reader';
  is_active?: boolean;
  created_by?: number;
  search?: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserCreatePayload extends CreateUserDto {}

export interface UserUpdatePayload extends UpdateUserDto {}

export type UserResponse = User; 