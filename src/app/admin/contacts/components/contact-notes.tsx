"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, User, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import type {
  Contact,
  ContactNote,
  ContactNoteCreatePayload,
} from "@/types/contact";

interface ContactNotesProps {
  contact: Contact;
  onNotesUpdate: (notes: ContactNote[]) => void;
}

export function ContactNotes({ contact, onNotesUpdate }: ContactNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const notes = Array.isArray(contact.notes) ? contact.notes : [];

  const { data: session } = useSession();
  const userName = session?.user?.name || "desconocido";

  function isNoteObject(
    note: unknown
  ): note is { id?: number; text: string; createdBy: string } {
    return (
      typeof note === "object" &&
      note !== null &&
      "text" in note &&
      "createdBy" in note
    );
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      const payload: ContactNoteCreatePayload = {
        text: newNote.trim(),
        createdBy: userName,
      };
      const response = await fetch(`/api/contacts/${contact.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la nota");
      }
      const newNoteData: ContactNote = await response.json();
      const updatedNotes = [...notes, newNoteData];
      onNotesUpdate(updatedNotes as ContactNote[]);
      setNewNote("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId?: number) => {
    if (!noteId) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: noteId }),
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la nota");
      }
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      onNotesUpdate(updatedNotes as ContactNote[]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = (note: ContactNote) => {
    setEditingNoteId(note.id ?? null);
    setEditText(note.text);
  };

  const handleSaveEdit = async (noteId?: number) => {
    if (!noteId || !editText.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: noteId, text: editText }),
      });
      if (!response.ok) {
        throw new Error("Error al editar la nota");
      }
      const updatedNotes = notes.map((n) =>
        n.id === noteId ? { ...n, text: editText } : n
      );
      onNotesUpdate(updatedNotes as ContactNote[]);
      setEditingNoteId(null);
      setEditText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditText("");
  };

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-lg font-semibold">Notas</CardTitle>
            <Badge variant="secondary">{notes.length}</Badge>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            disabled={submitting}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            {isAdding ? "Cerrar" : "Agregar"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* --- Nueva nota --- */}
        {isAdding && (
          <div className="space-y-3 p-4 bg-muted/40 rounded-xl border">
            <Textarea
              placeholder="Escribe una nueva nota..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote("");
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || submitting}
              >
                {submitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        )}

        {/* --- Lista de notas --- */}
        {notes.length > 0 ? (
          <ScrollArea className="h-[400px] w-full pr-2">
            <div className="space-y-4">
              {notes.filter(isNoteObject).map((note, index) => (
                <div
                  key={note.id || `note-${index}`}
                  className="p-3 rounded-lg border bg-card hover:shadow-sm transition"
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={submitting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={!editText.trim() || submitting}
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-relaxed">{note.text}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{note.createdBy}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEditNote(note)}
                          disabled={submitting}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={submitting}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No hay notas</p>
            <p className="text-xs">
              Haz clic en <span className="font-semibold">"Agregar"</span> para
              comenzar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
