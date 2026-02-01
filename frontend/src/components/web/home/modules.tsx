import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Calculator,
  FileSignature,
  UserPlus,
  LineChart,
  RefreshCw,
  Trophy,
  GraduationCap,
  Gift,
  HandHeart,
  Banknote,
  ShieldCheck,
  Rocket,
  Play,
} from "lucide-react";

export default function Modules() {
  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Módulos Integrados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las funcionalidades que transformarán tu gestión de recursos humanos
          </p>
        </div>

        {/* Grid de módulos */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Administración */}
          <ModuleCard
            gradient="from-[#035AA6] to-[#07598C]"
            icon={<Settings className="w-7 h-7 text-white" />}
            title="Administración"
            items={[
              { icon: <Calculator className="w-4 h-4 text-[#035AA6]" />, label: "Nómina automática" },
              { icon: <FileSignature className="w-4 h-4 text-[#035AA6]" />, label: "Firma electrónica" },
              { icon: <UserPlus className="w-4 h-4 text-[#035AA6]" />, label: "Onboarding & asistencia" },
            ]}
          />

          {/* Desarrollo Organizacional */}
          <ModuleCard
            gradient="from-[#11B4D9] to-[#07598C]"
            icon={<LineChart className="w-7 h-7 text-white" />}
            title="Gestión del cambio"
            items={[
              { icon: <RefreshCw className="w-4 h-4 text-[#11B4D9]" />, label: "Evaluaciones 360°" },
              { icon: <Trophy className="w-4 h-4 text-[#11B4D9]" />, label: "Reconocimiento y cultura" },
              { icon: <GraduationCap className="w-4 h-4 text-[#11B4D9]" />, label: "Capacitación y encuestas" },
            ]}
          />

          {/* Beneficios Flexibles */}
          <ModuleCard
            gradient="from-[#038C7F] to-[#11B4D9]"
            icon={<Gift className="w-7 h-7 text-white" />}
            title="Beneficios Flexibles"
            items={[
              { icon: <HandHeart className="w-4 h-4 text-[#038C7F]" />, label: "Gestión de beneficios" },
              { icon: <Banknote className="w-4 h-4 text-[#038C7F]" />, label: "Adelantos & descuentos" },
              { icon: <ShieldCheck className="w-4 h-4 text-[#038C7F]" />, label: "Seguros y protección" },
            ]}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white border-none">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">¿Listo para optimizar tu gestión de RRHH?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Descubre cómo estos módulos pueden transformar la eficiencia de tu departamento
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-[#035AA6] hover:bg-gray-100">
                  <Link href="/contact">
                    <span className="inline-flex items-center gap-2">
                      <Rocket className="w-4 h-4" /> Comenzar Ahora
                    </span>
                  </Link>
                </Button>
                <Button asChild className="bg-gray-50/10 border border-white text-white hover:bg-white hover:text-[#035AA6]">
                  <Link href="https://emmahr.net/">
                    <span className="inline-flex items-center gap-2">
                      <Play className="w-4 h-4" /> Ver Demo
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({
  gradient,
  icon,
  title,
  items,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  items: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
        </div>
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="flex items-center text-gray-700">
              <span className="mr-3 w-4 h-4 flex items-center justify-center">{it.icon}</span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
