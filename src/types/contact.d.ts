import { JsonArray } from "@prisma/client/runtime/library";

export interface ContactNote {
  id?: number;
  text: string;
  createdBy: string;
  [key: string]: JsonArray;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  notes: ContactNote[];
  status: "new" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactListResponse {
  data: Contact[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContactCreatePayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string;
  subject?: string;
  message: string;
  status?: "new" | "read" | "replied";
  notes?: ContactNote[];
}

export interface ContactUpdatePayload {
  name?: string;
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
  createdBy: string;
}

export type ContactResponse = Contact;
