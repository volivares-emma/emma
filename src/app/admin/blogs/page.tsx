"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import type { Blog, BlogListResponse } from "@/types/blog";

import { BlogCard } from "@/app/admin/blogs/components/blog-card";
import { BlogStats } from "@/app/admin/blogs/components/blog-stats";
import { BlogPagination } from "@/app/admin/blogs/components/blog-pagination";
import { BlogDialog } from "@/app/admin/blogs/components/blog-dialog";
import Skeleton from "@/components/loading/skeleton-admin";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  // Trae los archivos asociados a cada blog
  const fetchFiles = async (blogId: number) => {
    try {
      const related_type = "blog";
      const response = await fetch(
        `/api/files?related_type=${related_type}&related_id=${blogId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/blogs?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      const blogsResponse: BlogListResponse = await response.json();
      const plainBlogs: Blog[] = blogsResponse.data || [];
      
      // Trae los archivos en paralelo para cada blog
      const blogsWithFiles = await Promise.all(
        plainBlogs.map(async (blog) => {
          const files = await fetchFiles(blog.id);
          return { ...blog, files };
        })
      );
      
      setBlogs(blogsWithFiles);
      setTotalItems(blogsResponse.total || 0);
      setTotalPages(Math.ceil((blogsResponse.total || 0) / itemsPerPage));
    } catch (error) {
      toast.error("Error al cargar blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setDialogOpen(true);
  };

  const handleDelete = async (blog: Blog) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este blog?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Blog eliminado");
        if (blogs.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);
        else fetchBlogs();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    fetchBlogs();
    setEditBlog(null);
  };

  const handleNewBlog = () => {
    setEditBlog(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blogs
          </h1>
          <p className="text-muted-foreground">
            Gestiona artículos y contenido del blog
          </p>
        </div>
        <Button
          onClick={handleNewBlog}
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nuevo blog
        </Button>
      </div>

      <BlogStats
        totalItems={totalItems}
        blogs={blogs}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="relative">
        {loading && <Skeleton image lines={2} withButton />}
        {!loading && blogs.length === 0 ? (
          <Card className="p-12 shadow-xl bg-white/80">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-blue-700">
                No hay blogs registrados
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer blog para comenzar.
              </p>
              <Button
                onClick={handleNewBlog}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Crear primer blog
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <BlogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editBlog={editBlog}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
