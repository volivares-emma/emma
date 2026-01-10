"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { MotionFadeUp, MotionFadeScale } from "@/components/ui/motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import SkeletonSlide from "@/components/loading/skeleton-slide";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadFull } from "tsparticles";
import type { Slide } from "@/types/slide";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  UserPlus,
  CheckCircle2,
  Star,
  Gauge,
  TrendingUp,
  BarChart3,
  Activity,
  ShieldCheck,
  Cpu,
  Cloud,
  Database,
  Workflow,
} from "lucide-react";

// Tipos
export type VisualType =
  | "dashboard"
  | "analytics"
  | "team"
  | "growth"
  | "innovation";

export default function Slides() {
  const [loading, setLoading] = useState(true);
  const [particlesReady, setParticlesReady] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-slide functionality
  useEffect(() => {
    const activeSlides = slides.filter(s => s.isActive);
    if (activeSlides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000); // Cambiar cada 6 segundos
    
    return () => clearInterval(interval);
  }, [slides]);

  // Fetch slides from API
  useEffect(() => {
    fetchSlides();
  }, []);

  // Trae los archivos asociados a cada slide
  const fetchFiles = async (slideId: number) => {
    try {
      const response = await fetch(
        `/api/files?related_type=slide&related_id=${slideId}`,
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

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/slides", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const plainSlides: Slide[] = data.data || data.slides || [];
      // Trae los archivos en paralelo para cada slide
      const slidesWithFiles = await Promise.all(
        plainSlides.map(async (s) => {
          const files = await fetchFiles(s.id);
          return { ...s, files };
        })
      );

      console.log("Slides with files:", slidesWithFiles);
      // Ordenar por sortOrder
      const sortedSlides = slidesWithFiles.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setSlides(sortedSlides);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar slides", {
        description: "No se pudieron cargar los slides.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Inicializa el engine de partículas cargando el bundle completo de tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  if (loading) {
    return <SkeletonSlide />;
  }

  const activeSlides = slides.filter(s => s.isActive);
  
  if (activeSlides.length === 0) {
    return null;
  }

  const slide = activeSlides[currentSlide];

  return (
    <section className="relative">
      <div
        className="relative flex items-center gap-0.5 overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage:
            Array.isArray(slide.files) &&
            slide.files.length > 0 &&
            slide.files[0].path
              ? `url('${slide.files[0].path}')`
              : undefined,
        }}
      >
        <div
          className={`absolute inset-0 bg-linear-to-br transition-all duration-1000 ${
            Array.isArray(slide.files) &&
            slide.files.length > 0 &&
            slide.files[0].path
              ? "from-[#0D0D0D]/70 via-slate-900/90 to-[#035AA6]/90"
              : "from-[#0D0D0D] via-slate-900 to-[#035AA6]"
          }`}
        />
        {particlesReady && (
          <Particles
            id={`tsparticles-${slide.id}`}
            className="absolute inset-0 pointer-events-none z-0"
            options={{
              fullScreen: { enable: false },
              background: { color: "transparent" },
              particles: {
                number: { value: 50, density: { enable: true } },
                color: { value: "#fff" },
                shape: { type: "circle" },
                opacity: { value: 0.1 },
                size: { value: { min: 2, max: 4 } },
                links: {
                  enable: true,
                  distance: 150,
                  color: "#fff",
                  opacity: 0.1,
                  width: 1.5,
                },
                move: {
                  enable: true,
                  speed: 2,
                  direction: "none",
                  random: true,
                  straight: false,
                  outModes: { default: "out" },
                },
              },
            }}
          />
        )}

        {/* Fondo decorativo y grid */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-[#035AA6]/20 to-[#11B4D9]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-[#07598C]/20 to-[#038C7F]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-r from-[#11B4D9]/10 to-[#035AA6]/10 rounded-full blur-3xl animate-pulse" />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`border border-[#11B4D9] rounded ${
                    i % 3 === 0 ? "animate-pulse" : ""
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container md:mb-12 lg:mb-2 min-h-[90vh] mx-auto px-6 md:px-8 lg:px-10 z-10 flex items-center">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Texto */}
              <div className="flex flex-col justify-center md:mt-12 lg:mt-0">
                <MotionFadeUp delay={0.1} key={slide.id}>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight animate-pulse">
                    <span className="bg-linear-to-r from-white via-[#11B4D9] to-white bg-clip-text text-transparent drop-shadow-2xl">
                      {slide.title}
                    </span>
                  </h1>
                  <p className="text-xl text-[#11B4D9]/80 mb-6 font-light leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <p className="text-slate-300 mb-6 leading-relaxed max-w-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <Button
                      asChild
                      className="relative bg-linear-to-r from-[#035AA6] via-[#11B4D9] to-[#07598C] text-white px-6 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-[#11B4D9]/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                    >
                      <Link href={slide.buttonLink || "/contact"}>
                        <span className="relative flex items-center gap-2">
                          <Users className="h-5 w-5" /> {slide.buttonText}
                        </span>
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="bg-slate-100/10 border-2 border-slate-400/30 text-slate-200 px-6 py-6 rounded-2xl font-bold hover:border-[#11B4D9]/50 hover:text-[#11B4D9]"
                    >
                      <a
                        href="https://emmahr.net"
                        target="_blank"
                        rel="noopener"
                      >
                        <span className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5" /> Ver Funciones
                        </span>
                      </a>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#07598C]/50">
                    <Stat
                      v="500+"
                      k="Horas de desarrollo"
                      className="text-[#11B4D9]"
                    />
                    <Stat v="Azure" k="Cloud" className="text-[#035AA6]" />
                    <Stat
                      v="10K+"
                      k="Empleados soportados"
                      className="text-[#038C7F]"
                    />
                  </div>
                </MotionFadeUp>
              </div>

              {/* Visualización */}
              <div className="hidden md:flex justify-center">
                <MotionFadeScale delay={0.4} key={`visual-${slide.id}`}>
                  <div className="relative bg-[#0D0D0D]/30 rounded-3xl border border-[#07598C]/50 p-6 shadow-2xl hover:shadow-[#11B4D9]/10 transition-all duration-500 w-full max-w-lg">
                    <VisualRenderer type={slide.visualType} />
                  </div>
                </MotionFadeScale>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        {activeSlides.length > 1 && (
          <>
            {/* Indicadores de slide */}
            <div className="absolute bottom-4 md:bottom-2 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125 shadow-lg"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// === Visual Renderer ===
function VisualRenderer({ type }: { type: VisualType }) {
  if (type === "dashboard") return <DashboardVisual />;
  if (type === "analytics") return <AnalyticsVisual />;
  if (type === "team") return <TeamVisual />;
  if (type === "growth") return <GrowthVisual />;
  return <InnovationVisual />;
}

// ---- Dashboard ----
function DashboardVisual() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Panel de RRHH</h3>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#038C7F] rounded-full animate-pulse" />
          <span className="text-xs text-slate-300">Tiempo real</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <MetricCard
          tone="cyan"
          icon={<Users className="w-6 h-6 text-[#11B4D9]" />}
          label="Empleados Activos"
          value="2,847"
          delta="12%"
        />
        <MetricCard
          tone="emerald"
          icon={<UserPlus className="w-6 h-6 text-[#038C7F]" />}
          label="Nuevas Contrataciones"
          value="156"
          delta="8%"
        />
        <MetricCard
          tone="cyan"
          icon={<CheckCircle2 className="w-6 h-6 text-[#11B4D9]" />}
          label="Retención"
          value="94.2%"
          delta="5%"
        />
        <MetricCard
          tone="amber"
          icon={<Star className="w-6 h-6 text-amber-400" />}
          label="Satisfacción"
          value="4.8"
          delta="3%"
        />
      </div>

      {/* Performance */}
      <div className="bg-linear-to-br from-[#0D0D0D]/30 to-[#035AA6]/30 rounded-2xl p-4 border border-[#07598C]/30">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-slate-200">
            Eficiencia HR Global
          </span>
          <span className="font-bold text-[#11B4D9]">92%</span>
        </div>
        <div className="relative w-full bg-[#0D0D0D] rounded-full h-3 overflow-hidden">
          <div
            className="absolute inset-0 bg-linear-to-r from-[#11B4D9] to-[#035AA6] rounded-full animate-pulse shadow-lg shadow-[#11B4D9]/50"
            style={{ width: "92%" }}
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-[#11B4D9]/50 to-[#035AA6]/50 rounded-full animate-pulse [animation-delay:500ms]"
            style={{ width: "92%" }}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  tone,
  icon,
  label,
  value,
  delta,
}: {
  tone: "cyan" | "emerald" | "amber";
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
}) {
  const toneMap: Record<
    string,
    { from: string; borderHover: string; padBg: string }
  > = {
    cyan: {
      from: "from-[#0D0D0D]/50 to-[#035AA6]/50",
      borderHover: "hover:border-[#11B4D9]/50",
      padBg: "bg-[#035AA6]/20",
    },
    emerald: {
      from: "from-[#0D0D0D]/50 to-[#035AA6]/50",
      borderHover: "hover:border-[#038C7F]/50",
      padBg: "bg-[#038C7F]/20",
    },
    amber: {
      from: "from-[#0D0D0D]/50 to-[#035AA6]/50",
      borderHover: "hover:border-amber-500/50",
      padBg: "bg-amber-500/20",
    },
  };
  const t = toneMap[tone];
  return (
    <div
      className={`group bg-linear-to-br ${t.from} rounded-2xl p-4 border border-[#07598C]/50 ${t.borderHover} transition-all duration-300 [transform:translateZ(0)]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${t.padBg} rounded-xl`}>{icon}</div>
        <div className="flex items-center text-sm font-semibold text-[#038C7F]">
          <span>{delta}</span>
        </div>
      </div>
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

// ---- Analytics ----
function AnalyticsVisual() {
  return (
    <div>
      <HeaderRow
        title="Analíticas de RRHH"
        indicator="Datos actualizados"
        dotClass="bg-blue-400"
      />

      <div className="space-y-4">
        <CardGlass
          icon={<Gauge className="h-6 w-6 text-violet-400" />}
          iconBg="from-violet-500/20 to-purple-500/20"
          title="Productividad por Equipos"
          subtitle="Análisis comparativo mensual"
        >
          <div className="grid grid-cols-3 gap-4">
            <KPI color="text-violet-400" label="Operaciones" value="+23%" />
            <KPI color="text-blue-400" label="Administración" value="+18%" />
            <KPI color="text-green-400" label="Comercial" value="+31%" />
          </div>
        </CardGlass>

        <CardGlass
          icon={<TrendingUp className="h-6 w-6 text-cyan-400" />}
          iconBg="from-cyan-500/20 to-blue-500/20"
          title="Matriz de Rendimiento"
          subtitle="Métricas clave de desempeño"
        >
          <MetricLine
            label="Gestión de Nóminas"
            value={95}
            barClass="from-cyan-400 to-blue-400"
            textClass="text-cyan-400"
          />
          <MetricLine
            label="Procesos de Selección"
            value={88}
            barClass="from-green-400 to-emerald-400"
            textClass="text-green-400"
          />
          <MetricLine
            label="Evaluaciones de Desempeño"
            value={91}
            barClass="from-purple-400 to-violet-400"
            textClass="text-purple-400"
          />
        </CardGlass>

        <Card className="relative bg-linear-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50">
          <CardContent className="p-6">
            <Badge className="absolute -top-2 -right-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
              Próximamente
            </Badge>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  Predicciones de Rotación
                </h4>
                <p className="text-sm text-slate-400">
                  IA avanzada identifica riesgos de abandono
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">94%</div>
                <div className="text-xs text-slate-400">Precisión esperada</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Team ----
function TeamVisual() {
  return (
    <div>
      <HeaderRow
        title="Equipo de RRHH"
        indicator="12 activos"
        dotClass="bg-green-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TeamCard
          initials="AG"
          name="Ana García"
          role="HR Manager"
          tone="cyan"
          status="online"
        />
        <TeamCard
          initials="CL"
          name="Carlos López"
          role="Recruiter"
          tone="purple"
          status="busy"
        />
        <TeamCard
          initials="MS"
          name="María Silva"
          role="HR Analyst"
          tone="emerald"
          status="online"
        />
        <TeamCard
          initials="JR"
          name="Juan Ruiz"
          role="Payroll Specialist"
          tone="orange"
          status="away"
        />
      </div>

      <Card className="bg-linear-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <KPI value="73%" label="Productividad" color="text-cyan-400" />
            <KPI value="12" label="Activos" color="text-green-400" />
            <KPI value="4.8" label="Rating" color="text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Growth ----
function GrowthVisual() {
  return (
    <div>
      <HeaderRow
        title="Crecimiento Empresarial"
        indicator="Tendencia alcista"
        dotClass="bg-green-400"
      />

      <div className="space-y-4">
        <CardGlass
          icon={<Cpu className="h-6 w-6 text-green-400" />}
          iconBg="from-green-500/20 to-emerald-500/20"
          title="Ahorro en Costos HR"
          subtitle="Optimización de procesos"
        >
          <div className="flex items-center justify-between">
            <div className="w-96 bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-green-400 to-emerald-500 h-4 rounded-full shadow-lg shadow-green-500/30 animate-pulse"
                style={{ width: "78%" }}
              />
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-400">-35%</div>
            </div>
          </div>
          <div className="text-xs text-end text-slate-400">
            Reducción de costos
          </div>
        </CardGlass>

        <CardGlass
          icon={<ShieldCheck className="h-6 w-6 text-purple-400" />}
          iconBg="from-purple-500/20 to-violet-500/20"
          title="Cumplimiento Normativo"
          subtitle="Adaptación a regulaciones locales"
        >
          <div className="flex items-center gap-4" />
          <div className="text-right">
            <div className="text-xl font-bold text-purple-400">100%</div>
            <div className="text-xs text-slate-400">Cumplimiento</div>
          </div>
        </CardGlass>

        <CardGlass
          icon={<Users className="h-6 w-6 text-blue-400" />}
          iconBg="from-blue-500/20 to-cyan-500/20"
          title="Tiempo de Procesos"
          subtitle="Automatización eficiente - 67%"
        >
          <div className="grid grid-cols-3 gap-4">
            <KPI value="500+" label="Empresas" color="text-blue-400" />
            <KPI value="50K+" label="Empleados" color="text-cyan-400" />
            <KPI value="15" label="Países" color="text-purple-400" />
          </div>
        </CardGlass>
      </div>
    </div>
  );
}

// ---- Innovation ----
function InnovationVisual() {
  return (
    <div>
      <HeaderRow
        title="Tecnología HR Avanzada"
        indicator="Powered by Azure"
        dotClass="bg-violet-400"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <TechCard
          title="IA para RRHH"
          subtitle="Análisis predictivo & Matching"
          desc="Inteligencia artificial aplicada a gestión de talento"
          icon={<Cpu className="h-6 w-6 text-white" />}
          badge="Próximamente"
          badgeClass="from-blue-500 to-cyan-500"
          halo="from-blue-500 to-cyan-600"
          hoverTextClass="group-hover:text-blue-300"
        />
        <TechCard
          title="Nómina Azure"
          subtitle="Seguro • Escalable • Confiable"
          desc="Procesamiento seguro de nóminas en Microsoft Azure"
          icon={<Cloud className="h-6 w-6 text-white" />}
          halo="from-green-500 to-emerald-600"
          hoverTextClass="group-hover:text-green-300"
        />
        <TechCard
          title="Big Data RRHH"
          subtitle="Analytics & Reportes Avanzados"
          desc="Análisis masivo del capital humano"
          icon={<Database className="h-6 w-6 text-white" />}
          badge="En desarrollo"
          badgeClass="from-purple-500 to-violet-500"
          halo="from-purple-500 to-violet-600"
          hoverTextClass="group-hover:text-purple-300"
        />
        <TechCard
          title="Workflows HR"
          subtitle="Automatización • Onboarding • Evaluaciones"
          desc="Procesos de RRHH automatizados y eficientes"
          icon={<Workflow className="h-6 w-6 text-white" />}
          halo="from-orange-500 to-red-600"
          hoverTextClass="group-hover:text-orange-300"
        />
      </div>

      <Card className="bg-linear-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <KPI value="99.9%" label="Uptime" color="text-blue-400" />
            <KPI value="2.3s" label="Respuesta" color="text-green-400" />
            <KPI value="24/7" label="Soporte" color="text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// === Reusables ===
function HeaderRow({
  title,
  indicator,
  dotClass,
}: {
  title: string;
  indicator: string;
  dotClass: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full animate-pulse ${dotClass}`} />
        <span className="text-sm text-slate-300">{indicator}</span>
      </div>
    </div>
  );
}

function KPI({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color ?? "text-white"} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function MetricLine({
  label,
  value,
  barClass,
  textClass,
}: {
  label: string;
  value: number;
  barClass?: string;
  textClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className={`bg-linear-to-r ${
              barClass ?? "from-cyan-400 to-blue-400"
            } h-2 rounded-full`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span
          className={`text-sm font-semibold ${textClass ?? "text-cyan-400"}`}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

function CardGlass({
  icon,
  iconBg,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-linear-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50">
      <CardContent className="px-4">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 bg-linear-to-br ${iconBg} rounded-xl`}>
            {icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function TeamCard({
  initials,
  name,
  role,
  tone = "cyan",
  status = "online",
}: {
  initials: string;
  name: string;
  role: string;
  tone?: "cyan" | "purple" | "emerald" | "orange";
  status?: "online" | "busy" | "away";
}) {
  const halo: Record<string, string> = {
    cyan: "from-cyan-500 to-blue-600",
    purple: "from-purple-500 to-violet-600",
    emerald: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
  };
  const borderHover: Record<string, string> = {
    cyan: "hover:border-cyan-500/50",
    purple: "hover:border-purple-500/50",
    emerald: "hover:border-green-500/50",
    orange: "hover:border-orange-500/50",
  };
  const statusMap: Record<
    string,
    { color: string; text: string; hint: string; pulse?: boolean }
  > = {
    online: {
      color: "bg-green-400",
      text: "En línea",
      hint: "Activa ahora",
      pulse: true,
    },
    busy: { color: "bg-amber-400", text: "Ocupado", hint: "En reunión" },
    away: { color: "bg-gray-400", text: "Ausente", hint: "Hace 2 min" },
  };
  const s = statusMap[status];

  return (
    <div
      className={`group bg-linear-to-br from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/50 ${borderHover[tone]} transition-all duration-300 hover:scale-105`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div
            className={`w-12 h-12 bg-linear-to-br ${halo[tone]} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
          >
            {initials}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${
              s.color
            } rounded-full border-2 border-slate-800 ${
              s.pulse ? "animate-pulse" : ""
            }`}
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div
            className={`${
              tone === "purple"
                ? "text-purple-400"
                : tone === "emerald"
                ? "text-green-400"
                : tone === "orange"
                ? "text-orange-400"
                : "text-cyan-400"
            } text-xs`}
          >
            {role}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{s.hint}</span>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${s.color}`} />
          <span className={s.color.replace("bg-", "text-")}>{s.text}</span>
        </div>
      </div>
    </div>
  );
}

function TechCard({
  title,
  subtitle,
  desc,
  icon,
  badge,
  badgeClass = "from-blue-500 to-cyan-500",
  halo = "from-blue-500 to-cyan-600",
  hoverTextClass = "group-hover:text-blue-300",
}: {
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
  badgeClass?: string;
  halo?: string;
  hoverTextClass?: string;
}) {
  return (
    <div className="group bg-linear-to-br from-slate-800/60 to-slate-700/60 rounded-2xl p-6 border border-slate-600/50 transition-all duration-300 hover:scale-105 cursor-pointer relative">
      {badge ? (
        <Badge
          className={`absolute -top-2 -right-2 bg-linear-to-r ${badgeClass} text-white shadow-lg `}
        >
          {badge}
        </Badge>
      ) : null}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 bg-linear-to-br ${halo} rounded-xl flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <div
            className={`text-lg font-bold text-white ${hoverTextClass} transition-colors`}
          >
            {title}
          </div>
          <div className="text-xs text-slate-400">{subtitle}</div>
        </div>
      </div>
      <div className="text-sm text-slate-300">{desc}</div>
    </div>
  );
}

function Stat({
  v,
  k,
  className,
}: {
  v: string;
  k: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold mb-1 ${className ?? "text-white"}`}>
        {v}
      </div>
      <div className="text-sm text-slate-400">{k}</div>
    </div>
  );
}
