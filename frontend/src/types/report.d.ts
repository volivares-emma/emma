export interface ReportFilters {
  start_date?: Date;
  end_date?: Date;
  course_id?: number;
  user_id?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'expired';
  category?: string;
  format?: 'pdf' | 'excel';
}

export interface CourseReportData {
  course: {
    id: number;
    title: string;
    instructor?: string;
    category?: string;
    duration_hours?: number;
  };
  statistics: {
    total_assigned: number;
    total_completed: number;
    total_in_progress: number;
    total_pending: number;
    completion_rate: number;
    average_completion_time?: number;
    average_score?: number;
  };
  students: Array<{
    user: {
      id: number;
      username: string;
      first_name?: string;
      last_name?: string;
      email?: string;
    };
    assignment_date: Date;
    started_at?: Date;
    completed_at?: Date;
    progress_percentage: number;
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    time_spent_minutes: number;
    certificate_issued: boolean;
  }>;
}

export interface UserReportData {
  user: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role: 'admin' | 'control_interno' | 'invitado';
  };
  statistics: {
    total_courses_assigned: number;
    total_courses_completed: number;
    total_courses_in_progress: number;
    total_certificates: number;
    completion_rate: number;
    total_hours_spent: number;
  };
  courses: Array<{
    course: {
      id: number;
      title: string;
      instructor?: string;
      category?: string;
      duration_hours?: number;
    };
    assignment_date: Date;
    started_at?: Date;
    completed_at?: Date;
    progress_percentage: number;
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    time_spent_minutes: number;
    certificate_issued: boolean;
  }>;
}

export interface GlobalReportData {
  period: {
    start_date: Date;
    end_date: Date;
  };
  overview: {
    total_courses: number;
    total_users: number;
    total_assignments: number;
    total_completions: number;
    total_certificates_issued: number;
    global_completion_rate: number;
  };
  courses_summary: Array<{
    course: {
      id: number;
      title: string;
      category?: string;
      instructor?: string;
    };
    total_assigned: number;
    total_completed: number;
    completion_rate: number;
  }>;
  users_summary: Array<{
    user: {
      id: number;
      username: string;
      first_name?: string;
      last_name?: string;
      role: 'admin' | 'control_interno' | 'invitado';
    };
    total_courses: number;
    completed_courses: number;
    completion_rate: number;
    certificates_earned: number;
  }>;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  template_path: string;
  variables: Array<{
    key: string;
    description: string;
    required: boolean;
  }>;
}

export interface GenerateCertificateData {
  user_name: string;
  course_title: string;
  completion_date: string;
  certificate_code: string;
  instructor?: string;
  duration_hours?: number;
  issue_date: string;
}