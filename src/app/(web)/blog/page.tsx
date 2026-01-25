"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Newspaper, 
  Clock, 
  Users, 
  ArrowRight, 
  Mail, 
  Zap, 
  Calendar,
  FileText,
  ImageIcon 
} from "lucide-react";
import { Blog } from "@/types/blog";

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

const tags = [
  "Cultura",
  "Talento",
  "Capacitación",
  "Compensaciones",
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featured, setFeatured] = useState<Blog | null>(null);
  const [rest, setRest] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", {
          method: "GET",
        });

        if (!res.ok) throw new Error("Error al obtener blogs");
        const { data } = await res.json();

        console.log(data);
        setBlogs(data);
        setFeatured(data[0] ?? null);
        setRest(data.slice(1));
      } catch {
        setBlogs([]);
        setFeatured(null);
        setRest([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setNewsletterStatus(null);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail, type: "blog" }),
      });
      if (!res.ok) throw new Error("Error en la suscripción");
      setNewsletterStatus(
        "¡Suscripción exitosa! Pronto recibirás novedades en tu correo."
      );
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus("Hubo un error al suscribirte. Intenta nuevamente.");
    }
  };

  const imgSrc = (img?: string) => img ?? "";

  return (
    <main>
      {/* Hero */}
      <div className="bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Blog <span className="text-[#11B4D9]">EMMA</span>
          </h1>
          <p className="text-xl mb-8 max-w-4xl mx-auto text-white/90">
            Tendencias, ideas y prácticas accionables para potenciar tu gestión
            de personas. Descubre el futuro de los recursos humanos con insights
            expertos y casos de éxito.
          </p>
          <div className="flex justify-center items-center gap-3 sm:gap-6 text-sm flex-wrap">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Newspaper className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>RRHH & Tecnología</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Actualizado frecuentemente</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Casos de éxito</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Skeleton simple mientras carga */}
        {loading && (
          <section className="max-w-7xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="aspect-videos w-full bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm space-y-4">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-full bg-white rounded-lg border border-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED BLOG - Imagen izquierda, contenido derecha */}
        {!loading && featured && (
          <section className="mb-16">
            <div className="max-w-7xl mx-auto">
              <a
                href={`/blog/${featured.slug}/`}
                className="group block overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100"
              >
                <article className="grid items-center gap-0 lg:grid-cols-2 min-h-100">
                  {/* Imagen del blog destacado - Lado izquierdo */}
                  <div className="relative h-full min-h-100">
                    {featured.files && featured.files.length > 0 ? (
                      <div className="h-full w-full overflow-hidden rounded-l-3xl relative">
                        <Image
                          src={featured.files[0].path}
                          alt={featured.title}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Efecto papel vintage con Tailwind puro */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply">
                          {/* Patrón de rayas horizontales */}
                          <div className="absolute inset-0 bg-linear-to-b from-amber-900/10 via-transparent to-amber-900/10 bg-repeat" 
                               style={{ backgroundSize: '100% 2px' }} />
                          
                          {/* Patrón de rayas verticales */}
                          <div className="absolute inset-0 bg-linear-to-r from-amber-800/5 via-transparent to-amber-800/5 bg-repeat" 
                               style={{ backgroundSize: '16px 100%' }} />
                          
                          {/* Manchas vintage */}
                          <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-amber-700/40 rounded-full" />
                          <div className="absolute top-[70%] right-[20%] w-1.5 h-1.5 bg-amber-900/30 rounded-full" />
                          <div className="absolute bottom-[30%] left-[80%] w-0.5 h-0.5 bg-amber-600/50 rounded-full" />
                          <div className="absolute top-[50%] left-[15%] w-1 h-1 bg-amber-800/35 rounded-full" />
                          <div className="absolute bottom-[60%] right-[40%] w-1 h-1 bg-amber-700/40 rounded-full" />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-linear-to-br from-[#035AA6]/10 via-[#11B4D9]/10 to-[#07598C]/10 rounded-l-3xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                          <div className="w-full h-full bg-linear-to-br from-[#035AA6]/10 to-[#11B4D9]/10" 
                               style={{
                                 backgroundImage: `radial-gradient(circle at 25% 25%, #035AA6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #11B4D9 1px, transparent 1px)`,
                                 backgroundSize: '40px 40px'
                               }} />
                        </div>
                        <div className="relative z-10 text-[#035AA6]/40">
                          <ImageIcon className="h-32 w-32" />
                        </div>
                      </div>
                    )}
                    
                    {/* Badge destacado flotante */}
                    <div className="absolute top-6 left-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#035AA6] to-[#11B4D9] px-4 py-2 text-white font-semibold shadow-lg">
                        <Zap className="h-4 w-4" />
                        Destacado
                      </span>
                    </div>
                  </div>

                  {/* Contenido del blog - Lado derecho */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center h-full">
                    <div className="space-y-6">
                      {/* Metadatos */}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-[#035AA6]/70 font-medium">
                          <Calendar className="h-4 w-4" />
                          <FormattedDate date={featured.pubDate} />
                        </div>
                        <span className="text-[#035AA6]/50">•</span>
                        <div className="flex items-center gap-2 text-[#035AA6]/70 font-medium">
                          <FileText className="h-4 w-4" />
                          <span>Artículo</span>
                        </div>
                      </div>

                      {/* Título */}
                      <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#035AA6]">
                        {featured.title}
                      </h2>

                      {/* Descripción */}
                      {featured.description && (
                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {featured.description}
                        </p>
                      )}

                      {/* Autor y CTA */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-linear-to-r from-[#035AA6] to-[#11B4D9] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {(featured.author?.username || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {featured.author?.username || 'Autor desconocido'}
                            </p>
                            <p className="text-sm text-gray-500">Autor del artículo</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[#035AA6] group-hover:text-[#11B4D9] transition-colors">
                          <span className="text-lg font-bold hidden sm:inline">Leer artículo completo</span>
                          <span className="text-lg font-bold sm:hidden">Leer más</span>
                          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            </div>
          </section>
        )}

        {/* GRID */}
        {!loading && (
          <section className="bg-linear-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0D0D0D] mb-2">
                Todos los artículos
              </h2>
              <p className="text-gray-600">
                Explora nuestra biblioteca completa de contenido
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog) => (
                <article
                  key={blog.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <a href={`/blog/${blog.slug}/`} className="block h-full">
                    {/* Imagen del blog */}
                    <div className="relative overflow-hidden">
                      {blog.files && blog.files.length > 0 ? (
                        <div className="aspect-video w-full overflow-hidden relative">
                          <Image
                            src={blog.files[0].path}
                            alt={blog.title}
                            width={400}
                            height={225}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Efecto papel vintage con Tailwind puro */}
                          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply">
                            {/* Patrón de rayas horizontales */}
                            <div className="absolute inset-0 bg-linear-to-b from-amber-900/8 via-transparent to-amber-900/8 bg-repeat" 
                                 style={{ backgroundSize: '100% 2px' }} />
                            
                            {/* Patrón de rayas verticales */}
                            <div className="absolute inset-0 bg-linear-to-r from-amber-800/5 via-transparent to-amber-800/5 bg-repeat" 
                                 style={{ backgroundSize: '13px 100%' }} />
                            
                            {/* Manchas vintage */}
                            <div className="absolute top-[25%] left-[25%] w-0.5 h-0.5 bg-amber-700/40 rounded-full" />
                            <div className="absolute top-[75%] right-[25%] w-1 h-1 bg-amber-900/30 rounded-full" />
                            <div className="absolute bottom-[30%] left-[75%] w-0.5 h-0.5 bg-amber-600/50 rounded-full" />
                          </div>
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-linear-to-br from-[#035AA6]/5 via-[#11B4D9]/5 to-[#07598C]/5 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-30">
                            <div className="w-full h-full bg-linear-to-br from-[#035AA6]/10 to-[#11B4D9]/10" 
                                 style={{
                                   backgroundImage: `radial-gradient(circle at 25% 25%, #035AA6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #11B4D9 1px, transparent 1px)`,
                                   backgroundSize: '20px 20px'
                                 }} />
                          </div>
                          <div className="relative z-10 text-[#035AA6]/30">
                            <ImageIcon className="h-16 w-16" />
                          </div>
                        </div>
                      )}
                      
                      {/* Badge de categoría flotante */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-[#035AA6] shadow-lg">
                          <FileText className="h-3 w-3" />
                          Artículo
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex flex-col h-[calc(100%-225px)]">
                      {/* Fecha */}
                      <div className="flex items-center gap-2 text-xs text-[#035AA6]/70 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        <FormattedDate date={blog.pubDate} />
                      </div>

                      {/* Título */}
                      <h3 className="text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#035AA6] line-clamp-2 grow">
                        {blog.title}
                      </h3>

                      {/* Descripción */}
                      {blog.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {blog.description}
                        </p>
                      )}

                      {/* Footer con autor y CTA */}
                      <div className="flex items-center mb-4 justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-linear-to-r from-[#035AA6] to-[#11B4D9] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {(blog.author?.username || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blog.author?.username || 'Autor desconocido'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[#035AA6] group-hover:text-[#11B4D9] transition-colors">
                          <span className="text-sm font-semibold">Leer</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {rest.length === 0 && !featured && (
              <div className="mx-auto max-w-md text-center text-gray-500">
                <p>No hay publicaciones aún. Pronto compartiremos novedades.</p>
              </div>
            )}

            {/* Newsletter CTA - Único punto de suscripción */}
            <div className="mt-16 bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="text-white h-8 w-8" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Newsletter <span className="text-[#11B4D9]">EMMA</span>
                  </h3>
                  <p className="text-lg text-white/90">
                    Recibe tendencias de RRHH, insights expertos y casos de éxito directamente en tu correo
                  </p>
                  <p className="text-sm text-white/70">
                    Un resumen mensual • Ideas prácticas • Cero spam
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                    <input
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      className="flex-1 min-w-0 rounded-2xl border-0 bg-white/90 backdrop-blur-sm px-6 py-4 text-gray-900 placeholder-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-white/50 transition-all text-lg"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="sm:shrink-0 sm:w-auto w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#035AA6] hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap"
                    >
                      Suscribirme gratis
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {newsletterStatus && (
                    <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl text-center text-white">
                      {newsletterStatus}
                    </div>
                  )}
                </form>
                
                <div className="flex items-center justify-center gap-6 text-sm text-white/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Mensual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>+500 suscriptores</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
