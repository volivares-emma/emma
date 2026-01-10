import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReactSimpleWYSIWYG from "react-simple-wysiwyg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, User } from "lucide-react";
import { toast } from "sonner";
import type { Blog, BlogCreatePayload } from "@/types/blog";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBlog?: Blog | null;
  onSuccess: () => void;
}

interface User {
  id: number;
  username: string;
  role: string;
}

const blogStatuses = {
  'draft': { 
    label: 'Borrador', 
    icon: Clock
  },
  'published': { 
    label: 'Publicado', 
    icon: CheckCircle
  }
};

export function BlogDialog({ open, onOpenChange, editBlog, onSuccess }: BlogDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<BlogCreatePayload>({
    title: "",
    description: "",
    content: "",
    authorId: 1,
    slug: "",
    status: "draft",
    pubDate: new Date().toISOString().split('T')[0],
  });

  // Cargar usuarios cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  // Actualizar formulario cuando editBlog cambia
  useEffect(() => {
    // Limpiar archivo y preview anterior
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);

    if (editBlog) {
      setForm({
        title: editBlog.title || "",
        description: editBlog.description || "",
        content: editBlog.content || "",
        authorId: editBlog.authorId || 1,
        slug: editBlog.slug || "",
        status: editBlog.status || "draft",
        pubDate: editBlog.pubDate ? new Date(editBlog.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setForm({
        title: "",
        description: "",
        content: "",
        authorId: 1,
        slug: "",
        status: "draft",
        pubDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editBlog]);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || data.users || []);
      } else {
        toast.error("Error al cargar usuarios", {
          description: "No se pudieron cargar los usuarios disponibles.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar usuarios", {
        description: "Error de conexión al cargar usuarios.",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const uploadFile = async (blogId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("related_type", "blog");
      formData.append("related_id", blogId.toString());

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al subir archivo");
    } catch (error) {
      console.error("uploadFile error:", error);
      toast.error("No se pudo subir la imagen del blog");
    }
  };

  // Editor WYSIWYG react-simple-wysiwyg

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const processedValue = name === 'authorId' ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editBlog 
        ? `/api/blogs/${editBlog.id}` 
        : "/api/blogs";
      const method = editBlog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const savedBlog: Blog = await response.json();

        if (file) {
          await uploadFile(savedBlog.id, file);
        }

        toast.success(
          editBlog 
            ? "Blog actualizado" 
            : "Blog creado",
          {
            description: editBlog
              ? "El blog se actualizó correctamente."
              : "El nuevo blog se creó correctamente.",
          }
        );
        onSuccess();
        onOpenChange(false);
        // Reset file state after successful save
        if (preview) {
          URL.revokeObjectURL(preview);
        }
        setFile(null);
        setPreview(null);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      toast.error("Error al guardar", {
        description: "No se pudo guardar el blog.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      content: "",
      authorId: 1,
      slug: "",
      status: "draft",
      pubDate: new Date().toISOString().split('T')[0],
    });
    // Cleanup preview URL before reset
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-full sm:max-w-[50vw] max-h-[95vh] overflow-y-auto px-8">
        <DialogHeader>
          <DialogTitle>
            {editBlog ? "Editar blog" : "Nuevo blog"}
          </DialogTitle>
          <DialogDescription>
            {editBlog 
              ? "Modifica los campos del blog y guarda los cambios." 
              : "Completa el formulario para crear un nuevo blog."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Título del blog"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="url-amigable"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="authorId">Autor *</Label>
              <Select
                value={form.authorId.toString()}
                onValueChange={(value) => handleSelectChange("authorId", value)}
                disabled={loadingUsers}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingUsers ? "Cargando usuarios..." : "Seleccionar autor..."} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-xs text-muted-foreground">{user.role}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(blogStatuses).map(([key, status]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <status.icon className="h-4 w-4" />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pubDate">Fecha de publicación *</Label>
            <Input
              id="pubDate"
              name="pubDate"
              type="date"
              value={form.pubDate}
              onChange={handleChange}
              required
              className="max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Breve descripción del blog..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Imagen del blog</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              key={open ? 'file-input' : 'file-input-reset'} // Force re-render to clear input
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                } else {
                  setFile(null);
                  setPreview(null);
                }
              }}
            />
            {preview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={120}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
              </div>
            )}
            {editBlog && editBlog.files && editBlog.files.length > 0 && !preview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <Image
                  src={editBlog.files[0].path}
                  alt="Imagen actual"
                  width={200}
                  height={120}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido *</Label>
            <div className="border rounded-md bg-background">
              <ReactSimpleWYSIWYG
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                style={{ minHeight: "350px", maxHeight: "600px", width: "100%" }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editBlog ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}