import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Bot,
  Check,
  Cog,
  MessagesSquare,
  HeartHandshake,
  Rocket,
  Cloud,
  ShieldCheck,
  Expand,
  Smartphone,
} from "lucide-react";

export default function Benefits() {
  return (
    <section className="py-20 bg-linear-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#11B4D9]/10 text-[#035AA6] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Lightbulb className="w-4 h-4 mr-2" /> Innovación en Desarrollo
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            El Futuro de la Gestión de RRHH está Aquí
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EMMA está siendo diseñado para revolucionar la manera en que las empresas gestionan su talento humano
          </p>
        </div>

        {/* Grid de beneficios */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <BenefitCard
            gradient="from-[#035AA6] to-[#11B4D9]"
            icon={<Bot className="w-7 h-7 text-white" />}
            title="Automatización Inteligente"
            status={{ text: "En desarrollo", color: "text-[#035AA6]" }}
            description="Diseñado para eliminar tareas repetitivas y acelerar procesos críticos mediante automatización avanzada"
            bullets={[
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Procesamiento automático de nóminas" },
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Generación inteligente de reportes" },
              { icon: <Cog className="w-4 h-4 text-[#035AA6]" />, text: "Workflows personalizables" },
            ]}
          />

          <BenefitCard
            gradient="from-[#11B4D9] to-[#07598C]"
            icon={<MessagesSquare className="w-7 h-7 text-white" />}
            title="Comunicación Unificada"
            status={{ text: "Arquitectura lista", color: "text-[#11B4D9]" }}
            description="Plataforma centralizada para mantener a todo el equipo conectado y alineado con los objetivos empresariales"
            bullets={[
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Centro de notificaciones inteligente" },
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Feedback bidireccional en tiempo real" },
              { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: "Canales de comunicación segmentados" },
            ]}
          />

          <BenefitCard
            gradient="from-[#038C7F] to-[#11B4D9]"
            icon={<HeartHandshake className="w-7 h-7 text-white" />}
            title="Compromiso Auténtico"
            status={{ text: "Conceptualizado", color: "text-[#038C7F]" }}
            description="Herramientas innovadoras para fomentar una cultura organizacional sólida y el crecimiento del talento"
            bullets={[
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Sistema de reconocimiento peer-to-peer" },
              { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: "Encuestas de clima organizacional" },
              { icon: <Cog className="w-4 h-4 text-[#038C7F]" />, text: "Métricas de engagement avanzadas" },
            ]}
          />
        </div>

        {/* Tecnología y roadmap */}
        <div className="bg-linear-to-r from-blue-950 to-cyan-950 rounded-3xl p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda */}
            <div>
              <div className="flex items-center mb-6">
                <Rocket className="w-8 h-8 text-amber-400 mr-4" />
                <h3 className="md:text-xl lg:text-2xl font-bold">Construido con Tecnología de Vanguardia</h3>
              </div>
              <p className="text-[#D1ECF9] mb-8">
                EMMA está siendo desarrollado con las mejores prácticas de la industria y tecnologías cloud nativas para garantizar escalabilidad, seguridad y rendimiento excepcional.
              </p>

              {/* Tecnologías */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <TechItem icon={<Cloud className="w-4 h-4 text-[#11B4D9]" />} label="Microsoft Azure" />
                <TechItem icon={<ShieldCheck className="w-4 h-4 text-[#038C7F]" />} label="Seguridad Empresarial" />
                <TechItem icon={<Expand className="w-4 h-4 text-[#11B4D9]" />} label="Arquitectura Escalable" />
                <TechItem icon={<Smartphone className="w-4 h-4 text-[#07598C]" />} label="Mobile First" />
              </div>

              <Button asChild className="bg-amber-400 text-[#035AA6] hover:bg-amber-300 font-semibold">
                <Link href="/roadmap" className="inline-flex items-center">
                  Ver Roadmap de Desarrollo
                </Link>
              </Button>
            </div>

            {/* Columna derecha - Timeline */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 text-center">Fases de Desarrollo</h4>
              <div className="space-y-4">
                <PhaseItem
                  dotColor="bg-[#038C7F]"
                  title="Fase 1: Fundación"
                  titleColor="text-[#038C7F]"
                  desc="Arquitectura base y módulos core"
                  tag={{ text: "Completado", bg: "bg-[#038C7F]/20", color: "text-[#038C7F]" }}
                />
                <PhaseItem
                  dotColor="bg-amber-400 animate-pulse"
                  title="Fase 2: Funcionalidades"
                  titleColor="text-amber-300"
                  desc="Nómina, empleados y reportes básicos"
                  tag={{ text: "En progreso", bg: "bg-amber-400/20", color: "text-amber-300" }}
                />
                <PhaseItem
                  dotColor="bg-[#11B4D9]"
                  title="Fase 3: Avanzado"
                  titleColor="text-[#11B4D9]"
                  desc="Automatización y analytics"
                  tag={{ text: "Q4 2025", bg: "bg-[#11B4D9]/20", color: "text-[#11B4D9]" }}
                />
                <PhaseItem
                  dotColor="bg-[#07598C]"
                  title="Fase 4: Lanzamiento"
                  titleColor="text-[#07598C]"
                  desc="Beta público y optimizaciones"
                  tag={{ text: "Q1 2026", bg: "bg-[#07598C]/20", color: "text-[#07598C]" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  gradient,
  icon,
  title,
  status,
  description,
  bullets,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  status: { text: string; color: string };
  description: string;
  bullets: { icon: React.ReactNode; text: string }[];
}) {
  return (
    <Card className="group bg-white rounded-2xl p-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#11B4D9]/10">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center text-sm text-gray-700">
              <span className="mr-2 flex items-center">{b.icon}</span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TechItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center">
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function PhaseItem({
  dotColor,
  title,
  titleColor,
  desc,
  tag,
}: {
  dotColor: string;
  title: string;
  titleColor: string;
  desc: string;
  tag: { text: string; bg: string; color: string };
}) {
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 ${dotColor} rounded-full mr-4 flex-shrink-0`} />
      <div>
        <h6 className={`font-semibold ${titleColor}`}>{title}</h6>
        <p className="text-xs text-[#D1ECF9]">{desc}</p>
      </div>
      <span className={`ml-auto text-xs ${tag.bg} ${tag.color} p-1 rounded`}>
        {tag.text}
      </span>
    </div>
  );
}
