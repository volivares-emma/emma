"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Mail, 
  Clock,
  ArrowRight,
  Zap,
  BookOpen 
} from "lucide-react";
import { Blog } from "@/types/blog";
import { toast } from "sonner";

function FormattedDate({ date }: { date: Date | string }) {
  const d = new Date(date);
  return (
    <span>
      {d.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long", 
        day: "numeric",
      })}
    </span>
  );
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    const fetchData = async () => {
      try {
        // Fetch del blog principal
        const blogRes = await fetch(`/api/blogs/slug/${slug}`, {
          method: "GET",
        });

        if (!blogRes.ok) {
          if (blogRes.status === 404) {
            setBlog(null);
          } else {
            throw new Error("Error al obtener blog");
          }
        } else {
          const blogData = await blogRes.json();
          setBlog(blogData);
        }

        // Fetch de blogs relacionados
        const relatedRes = await fetch("/api/blogs", {
          method: "GET",
        });

        if (relatedRes.ok) {
          const { data } = await relatedRes.json();
          // Filtrar el blog actual y tomar los primeros 4
          const filtered = data.filter((b: Blog) => b.slug !== slug).slice(0, 4);
          setRelatedBlogs(filtered);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail, type: "blog" }),
      });
      
      if (!res.ok) throw new Error("Error en la suscripción");
      
      toast.success("¡Suscripción exitosa! Pronto recibirás novedades en tu correo.");
      setNewsletterEmail("");
    } catch {
      toast.error("Hubo un error al suscribirte. Intenta nuevamente.");
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description || "Lee este artículo en nuestro blog",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copiar URL al clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success("URL copiada al clipboard");
      }).catch(() => {
        toast.error("No se pudo copiar la URL");
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Columna principal - Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-12 w-3/4 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-96 w-full bg-gray-200 rounded-3xl animate-pulse" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
              
              {/* Sidebar - Skeleton */}
              <div className="space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-linear-to-r from-[#035AA6] to-[#11B4D9] rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog no encontrado</h1>
          <p className="text-lg text-gray-600 mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white px-8 py-4 rounded-2xl hover:from-[#07598C] hover:to-[#035AA6] transition-all transform hover:scale-105 shadow-lg font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = blog.files && blog.files.length > 0 ? blog.files[0].path : null;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header moderno con navegación */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[#035AA6] hover:text-[#11B4D9] transition-all duration-300 font-semibold group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Volver al blog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Columna principal del artículo */}
            <article className="lg:col-span-2 space-y-8">
              
              {/* Header del artículo */}
              <header className="space-y-6">
                {/* Badge y metadatos */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#035AA6] to-[#11B4D9] px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    <Zap className="h-4 w-4" />
                    Artículo destacado
                  </span>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#035AA6]" />
                      <FormattedDate date={blog.pubDate} />
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#035AA6]" />
                      {blog.author?.username || 'Autor desconocido'}
                    </div>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 hover:text-[#035AA6] transition-colors duration-300 group"
                    >
                      <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Compartir
                    </button>
                  </div>
                </div>

                {/* Título principal */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {blog.title}
                </h1>

                {/* Descripción */}
                {blog.description && (
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                    {blog.description}
                  </p>
                )}
              </header>

              {/* Imagen principal con efecto */}
              {imageUrl && (
                <div className="relative group">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                    <Image
                      src={imageUrl}
                      alt={blog.title}
                      width={800}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ aspectRatio: "16/9" }}
                    />
                    {/* Efecto papel vintage con Tailwind */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply">
                      <div className="absolute inset-0 bg-linear-to-b from-amber-900/8 via-transparent to-amber-900/8 bg-repeat" 
                           style={{ backgroundSize: '100% 2px' }} />
                      <div className="absolute inset-0 bg-linear-to-r from-amber-800/5 via-transparent to-amber-800/5 bg-repeat" 
                           style={{ backgroundSize: '13px 100%' }} />
                      <div className="absolute top-[25%] left-[25%] w-0.5 h-0.5 bg-amber-700/40 rounded-full" />
                      <div className="absolute top-[75%] right-[25%] w-1 h-1 bg-amber-900/30 rounded-full" />
                      <div className="absolute bottom-[30%] left-[75%] w-0.5 h-0.5 bg-amber-600/50 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido del artículo */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200/50">
                <div className="prose prose-lg lg:prose-xl max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    className="text-gray-800 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#035AA6] [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-[#07598C] [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4"
                  />
                </div>
              </div>

              {/* CTA Newsletter modernizado */}
              <div className="bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                {/* Patrón de fondo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent" />
                  <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/10 rounded-full" />
                </div>
                
                <div className="relative text-center max-w-2xl mx-auto space-y-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl font-bold">¿Te gustó este artículo?</h3>
                    <p className="text-lg text-white/90">
                      Suscríbete para recibir más contenido como este directamente en tu correo
                    </p>
                    <p className="text-sm text-white/70">
                      Tendencias RRHH • Casos de éxito • Cero spam
                    </p>
                  </div>
                  
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="flex-1 rounded-2xl border-0 bg-white/20 backdrop-blur-sm px-6 py-4 text-white placeholder-white/60 outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all text-lg"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="bg-white text-[#035AA6] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                      >
                        Suscribirme gratis
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </article>

            {/* Sidebar con artículos relacionados */}
            <aside className="space-y-8">
              
              {/* Artículos relacionados */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-[#035AA6]" />
                  Más artículos
                </h3>
                
                <div className="space-y-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      href={`/blog/${relatedBlog.slug}/`}
                      className="group block space-y-3 p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-[#035AA6]/20"
                    >
                      {/* Imagen del artículo relacionado */}
                      {relatedBlog.files && relatedBlog.files.length > 0 && (
                        <div className="aspect-video rounded-xl overflow-hidden">
                          <Image
                            src={relatedBlog.files[0].path}
                            alt={relatedBlog.title}
                            width={300}
                            height={169}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      
                      {/* Contenido del artículo relacionado */}
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#035AA6] transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        
                        {relatedBlog.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {relatedBlog.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <FormattedDate date={relatedBlog.pubDate} />
                          </div>
                          
                          <div className="flex items-center gap-1 text-[#035AA6] group-hover:text-[#11B4D9] transition-colors">
                            <span className="font-semibold">Leer</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {relatedBlogs.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No hay artículos relacionados disponibles
                    </p>
                  )}
                  
                  {/* Ver todos los artículos */}
                  <Link
                    href="/blog"
                    className="block w-full text-center bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white py-3 rounded-2xl font-semibold hover:from-[#07598C] hover:to-[#035AA6] transition-all transform hover:scale-105 shadow-lg"
                  >
                    Ver todos los artículos
                  </Link>
                </div>
              </div>
              
            </aside>
            
          </div>
        </div>
      </div>
    </main>
  );
}
