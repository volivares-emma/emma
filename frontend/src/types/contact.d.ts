import { JsonArray } from "@prisma/client/runtime/library";

export interface ContactNote {
  id?: number;
  text: string;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: JsonArray;
}

export interface Contact {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  notes: ContactNote[];
  status: "new" | "read" | "replied";
  created_at: Date;
  updated_at: Date;
}

export interface ContactListResponse {
  data: Contact[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContactCreatePayload {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string;
  subject?: string;
  message: string;
  status?: "new" | "read" | "replied";
  notes?: ContactNote[];
}

export interface ContactUpdatePayload {
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  status?: "new" | "read" | "replied";
  notes?: ContactNote[];
}

export interface ContactNoteCreatePayload {
  text: string;
  created_by: number;
  created_by_name?: string;
}

export type ContactResponse = Contact;
