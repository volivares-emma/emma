export interface Testimonial {
  id: number;
  name: string;
  position?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TestimonialListResponse {
  data: Testimonial[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TestimonialCreatePayload {
  name: string;
  content: string;
  position?: string | null;
  company?: string | null;
  rating?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface TestimonialUpdatePayload {
  name?: string | null;
  content?: string | null;
  position?: string | null;
  company?: string | null;
  rating?: number | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
}


export type TestimonialResponse = Testimonial;