export interface Testimonial {
  id: number;
  name: string;
  position?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  isFeatured?: boolean;
}

export interface TestimonialUpdatePayload {
  name?: string | null;
  content?: string | null;
  position?: string | null;
  company?: string | null;
  rating?: number | null;
  isFeatured?: boolean | null;
}


export type TestimonialResponse = Testimonial;