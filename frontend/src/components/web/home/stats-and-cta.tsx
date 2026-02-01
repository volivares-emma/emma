import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Code2,
  Users,
  Eye,
  Rocket,
  Star,
  ShieldCheck,
  LineChart,
  Settings,
} from "lucide-react";

export default function StatsAndCTA() {
  return (
    <section className="py-20 bg-linear-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Potencial Comprobado en Desarrollo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EMMA está diseñado con tecnología de vanguardia para maximizar la eficiencia de tu equipo de RRHH
          </p>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard
            gradient="from-[#035AA6] to-[#07598C]"
            icon={<Clock className="w-9 h-9 text-white" />}
            value="80%"
            valueClass="text-[#035AA6]"
            title="Reducción de Tiempo"
            desc="Potencial de automatización en tareas administrativas repetitivas"
          />
          <StatCard
            gradient="from-[#038C7F] to-[#11B4D9]"
            icon={<Code2 className="w-9 h-9 text-white" />}
            value="500+"
            valueClass="text-[#038C7F]"
            title="Horas de Desarrollo"
            desc="Invertidas en crear una solución robusta y escalable"
          />
          <StatCard
            gradient="from-[#11B4D9] to-[#07598C]"
            icon={<Users className="w-9 h-9 text-white" />}
            value="10K+"
            valueClass="text-[#11B4D9]"
            title="Empleados Soportados"
            desc="Capacidad técnica para gestionar desde startups hasta grandes empresas"
          />
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#035AA6] via-[#11B4D9] to-[#07598C] rounded-3xl p-12 text-center text-white">
          {/* Decorativos */}
          <div className="absolute inset-0 pointer-events-none">
            <Users className="absolute top-10 left-10 opacity-20 w-16 h-16" />
            <LineChart className="absolute bottom-10 right-10 opacity-20 w-14 h-14" />
            <Settings className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-10 w-24 h-24" />
          </div>

          {/* Contenido */}
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">¿Listo para Ser Pionero en RRHH?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Únete al desarrollo de EMMA y sé parte de la próxima generación de gestión de recursos humanos
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild className="bg-white text-[#035AA6] hover:bg-gray-100 px-10 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl">
                <a href="https://emmahr.net/" target="_blank" rel="noopener">
                  <span className="inline-flex items-center gap-3">
                    <Eye className="w-5 h-5" /> Ver Prototipo
                  </span>
                </a>
              </Button>

              <Button asChild className="bg-gray-50/10 border-2 border-white text-white hover:bg-white hover:text-[#035AA6] px-10 py-6 rounded-xl font-bold">
                <Link href="/contact">
                  <span className="inline-flex items-center gap-3">
                    <Rocket className="w-5 h-5" /> Solicitar Acceso Beta
                  </span>
                </Link>
              </Button>
            </div>

            {/* Beneficios */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-blue-100">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" /> <span>Acceso anticipado</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> <span>Sin compromiso</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" /> <span>Programa exclusivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  gradient,
  icon,
  value,
  valueClass,
  title,
  desc,
}: {
  gradient: string;
  icon: React.ReactNode;
  value: string;
  valueClass?: string;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 bg-linear-to-br ${gradient} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <span className={`block text-5xl font-bold mb-2 ${valueClass ?? "text-gray-900"}`}>{value}</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
