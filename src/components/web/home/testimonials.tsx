"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, Calendar, BadgeCheck, Plus } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";
import SkeletonSlide from "@/components/loading/skeleton-slide";

export default function Testimonials() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [apiTestimonials, setApiTestimonials] = useState<Testimonial[] | null>(
    null
  );

  useEffect(() => {
    fetch("/api/testimonials", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((payload) => {
        console.log("Data recibida:", payload);
        const rawTestimonials: Testimonial[] = payload.data || [];
        setApiTestimonials(rawTestimonials);
      })
      .catch((error) => {
        setApiTestimonials([]);
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Testimonials data
  const testimonialsData: any[] = apiTestimonials && apiTestimonials.length > 0 ? apiTestimonials : [];

  // Slice for visible testimonials
  const visibleTestimonials = useMemo(
    () => testimonialsData.slice(0, visibleCount),
    [testimonialsData, visibleCount]
  );

  // Calculate average rating
  const avgRating = useMemo(() => {
    if (!testimonialsData.length) return "0.0";
    const avg =
      testimonialsData.reduce((s: number, t: any) => s + t.rating, 0) /
      testimonialsData.length;
    return avg.toFixed(1);
  }, [testimonialsData]);

  // Calculate number of industries
  const industries = useMemo(() => {
    const n = new Set(
      testimonialsData.map((t: any) => t.industry).filter(Boolean)
    ).size;
    return n || 15;
  }, [testimonialsData]);

  // Calculate customer satisfaction rate
  const satisfactionRate = useMemo(() => {
    if (!testimonialsData.length) return 0;
    const pct =
      (testimonialsData.filter((t: any) => t.rating >= 4).length /
        testimonialsData.length) *
      100;
    return Math.round(pct);
  }, [testimonialsData]);

  const loadMore = () => setVisibleCount((p) => Math.min(p + 6, testimonialsData.length));

  // Animations
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.07, duration: 0.45 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return <SkeletonSlide />;
  }

  return (
    <section className="py-20 bg-linear-to-br from-white via-gray-50 to-[#11B4D9]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#11B4D9]/10 text-[#035AA6] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" /> +{testimonialsData.length}{" "}
            empresas confían en EMMA
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lo que Dicen Nuestros{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#035AA6] to-[#11B4D9]">
              Clientes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre cómo EMMA está transformando la gestión de recursos humanos
            en empresas de todos los tamaños
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {visibleTestimonials.map((t: any) => (
            <motion.div key={t.id} variants={item}>
              <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#11B4D9]/10 relative group">
                <CardContent className="p-8">
                  {t.isFeatured && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-linear-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        <Star className="w-3.5 h-3.5 inline mr-1" /> Destacado
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-linear-to-br from-[#035AA6] to-[#11B4D9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {t.name}
                        </h3>
                        {t.position && (
                          <p className="text-gray-600 text-sm">{t.position}</p>
                        )}
                        {t.company && (
                          <p className="text-gray-500 text-xs">{t.company}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating ? "text-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-gray-700 text-base leading-relaxed mb-6 italic relative">
                    <span className="absolute -top-6 -left-6 text-6xl text-[#11B4D9]/30 font-serif">
                      “
                    </span>
                    {t.content}
                  </blockquote>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(t.createdAt).toLocaleDateString("es-ES")}
                    </span>
                    {t.isActive && (
                      <span className="flex items-center text-[#038C7F] bg-[#038C7F]/10 px-2 py-1 rounded-full">
                        <BadgeCheck className="w-4 h-4 mr-1" /> Verificado
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load more */}
        {testimonialsData.length > visibleCount && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white px-8 py-6 rounded-xl font-semibold hover:from-[#07598C] hover:to-[#11B4D9] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" /> Cargar más testimonios
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-20 bg-linear-to-r from-[#035AA6] via-[#11B4D9] to-[#07598C] rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {testimonialsData.length}+
              </div>
              <div className="text-[#D1ECF9] text-sm uppercase tracking-wide">
                Empresas Activas
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {avgRating}/5
              </div>
              <div className="text-[#D1ECF9] text-sm uppercase tracking-wide">
                Calificación Promedio
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {industries}+
              </div>
              <div className="text-[#D1ECF9] text-sm uppercase tracking-wide">
                Industrias Diferentes
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {satisfactionRate}%
              </div>
              <div className="text-[#D1ECF9] text-sm uppercase tracking-wide">
                Satisfacción Cliente
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
