"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserPlus,
  Mail,
  MessageSquare,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/admin/data-table";
import { ContactNotes } from "@/app/admin/contacts/components/contact-notes";
import { createContactColumns } from "./components/contacts-columns";
import type {
  Contact,
  ContactCreatePayload,
  ContactUpdatePayload,
  ContactNote,
} from "@/types/contact";
import type { ContactStatus } from "@/app/admin/contacts/components/contact-status";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactCreatePayload>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    status: "new",
    notes: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const itemsPerPage = 10;

  // Estadísticas
  const totalContacts = totalItems;
  const newContacts = contacts.filter((c) => c.status === "new").length;
  const readContacts = contacts.filter((c) => c.status === "read").length;
  const repliedContacts = contacts.filter((c) => c.status === "replied").length;

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/contacts?page=${currentPage}&pageSize=${itemsPerPage}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Deserializar notes si viene como JsonValue
      const contactsFixed = (data.data || []).map((c: Contact) => ({
        ...c,
        notes: Array.isArray(c.notes)
          ? c.notes
          : c.notes
          ? JSON.parse(JSON.stringify(c.notes))
          : [],
      }));
      setContacts(contactsFixed);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (contact?: Contact) => {
    setEditContact(contact || null);
    setForm(
      contact
        ? {
            name: contact.name,
            email: contact.email,
            phone: contact.phone ?? "",
            company: contact.company ?? "",
            subject: contact.subject ?? "",
            message: contact.message,
            status: contact.status,
            notes: Array.isArray(contact.notes)
              ? contact.notes
              : contact.notes
              ? JSON.parse(JSON.stringify(contact.notes))
              : [],
          }
        : {
            name: "",
            email: "",
            phone: "",
            company: "",
            subject: "",
            message: "",
            status: "new",
            notes: [],
          }
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditContact(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      status: "new",
      notes: [],
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let url = "/api/contacts";
      let method = "POST";
      if (editContact) {
        url = `/api/contacts/${editContact.id}`;
        method = "PATCH";
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Error al guardar el contacto");
      }
      await fetchContacts();
      closeDialog();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el contacto de ${contact.name}?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/contacts?id=${contact.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Error al eliminar el contacto");
      }
      await fetchContacts();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleViewNotes = (contact: Contact) => {
    setSelectedContact(contact);
    setShowNotes(true);
  };

  const handleNotesUpdate = (notes: ContactNote[]) => {
    if (selectedContact) {
      const updatedContact = { ...selectedContact, notes };
      setSelectedContact(updatedContact);

      // Actualizar el contacto en la lista local
      setContacts((prevContacts) =>
        prevContacts.map((c) =>
          c.id === selectedContact.id ? { ...c, notes } : c
        )
      );
    }
  };

  const handleStatusChange = (contactId: number, newStatus: ContactStatus) => {
    fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    }).then((res) => {
      if (res.ok) {
        setContacts((prevContacts) =>
          prevContacts.map((c) =>
            c.id === contactId ? { ...c, status: newStatus } : c
          )
        );
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }
      }
    });
  };

  const columns = createContactColumns(
    openDialog,
    handleDelete,
    handleViewNotes,
    handleStatusChange
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona los contactos recibidos desde el formulario web
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo contacto
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {newContacts}
            </div>
            <p className="text-xs text-muted-foreground">Sin leer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leídos</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {readContacts}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {repliedContacts}
            </div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Todos los contactos</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contactos</CardTitle>
          <CardDescription>
            Todos los contactos recibidos a través del formulario web
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
                   <div className="grid gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={contacts}
              currentPage={currentPage}
              pageCount={totalPages}
              onPageChange={setCurrentPage}
              searchKey="name"
              searchPlaceholder="Buscar contactos..."
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editContact ? "Editar contacto" : "Nuevo contacto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone ?? ""} 
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={form.company ?? ""}
                  onChange={handleChange}
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                name="subject"
                value={form.subject ?? ""}
                onChange={handleChange}
                placeholder="Asunto del mensaje"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje *</Label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Mensaje del contacto"
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : editContact
                  ? "Guardar cambios"
                  : "Crear contacto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Notas del Contacto: {selectedContact?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactNotes
              contact={selectedContact}
              onNotesUpdate={handleNotesUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
