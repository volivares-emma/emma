export interface Course {
  id: number;
  title: string;
  description?: string;
  content?: string;
  duration_hours?: number;
  instructor?: string;
  category?: string;
  meeting_link?: string;
  max_students?: number;
  status: 'draft' | 'published' | 'archived' | 'inactive';
  is_active: boolean;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_url?: string;
  material_type: 'pdf' | 'video' | 'link' | 'document' | 'presentation';
  file_size?: number;
  sort_order: number;
  is_required: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CourseAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_by: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  assigned_at: Date;
  started_at?: Date;
  completed_at?: Date;
  due_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CourseProgress {
  id: number;
  assignment_id: number;
  user_id: number;
  course_id: number;
  progress_percentage: number;
  current_module?: string;
  time_spent_minutes: number;
  last_accessed_at?: Date;
  completion_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_code: string;
  issued_at: Date;
  file_path?: string;
  file_url?: string;
  template_used?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// DTOs para formularios
export interface CreateCourseDto {
  title: string;
  description?: string;
  content?: string;
  duration_hours?: number;
  instructor?: string;
  category?: string;
  meeting_link?: string;
  max_students?: number;
  status?: 'draft' | 'published' | 'archived' | 'inactive';
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  is_active?: boolean;
}

export interface AssignCourseDto {
  course_id: number;
  user_ids: number[];
  due_date?: Date;
  notes?: string;
}

export interface UpdateProgressDto {
  progress_percentage?: number;
  current_module?: string;
  time_spent_minutes?: number;
  completion_notes?: string;
}

export interface CourseFilters {
  status?: 'draft' | 'published' | 'archived' | 'inactive';
  category?: string;
  instructor?: string;
  created_by?: number;
  search?: string;
}

// Interfaces para respuestas de API
export interface CourseWithRelations extends Course {
  creator: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  materials?: CourseMaterial[];
  assignments?: CourseAssignment[];
  _count?: {
    assignments: number;
    materials: number;
  };
}

export interface UserCourseInfo {
  course: Course;
  assignment: CourseAssignment;
  progress?: CourseProgress;
  certificate?: Certificate;
  materials: CourseMaterial[];
}

export interface CourseReport {
  course: Course;
  total_assigned: number;
  total_completed: number;
  total_in_progress: number;
  total_pending: number;
  completion_rate: number;
  average_completion_time?: number;
  students: Array<{
    user: {
      id: number;
      username: string;
      first_name?: string;
      last_name?: string;
      email?: string;
    };
    assignment: CourseAssignment;
    progress?: CourseProgress;
    certificate?: Certificate;
  }>;
}