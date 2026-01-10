import {
  Rocket,
  Store,
  Factory,
  Handshake,
  HeartPulse,
  GraduationCap,
  ShieldCheck,
  Cloud,
  Expand,
} from "lucide-react";

export default function TrustSection() {
  const industries: { title: string; subtitle: string; gradient: string; icon: React.ComponentType<any> }[] = [
    { title: "Startups", subtitle: "Tecnología", gradient: "from-[#035AA6] to-[#07598C]", icon: Rocket },
    { title: "Retail", subtitle: "Comercio", gradient: "from-[#11B4D9] to-[#07598C]", icon: Store },
    { title: "Manufactura", subtitle: "Industrial", gradient: "from-[#038C7F] to-[#11B4D9]", icon: Factory },
    { title: "Servicios", subtitle: "Consultoría", gradient: "from-[#07598C] to-[#035AA6]", icon: Handshake },
    { title: "Salud", subtitle: "Médico", gradient: "from-[#11B4D9] to-[#038C7F]", icon: HeartPulse },
    { title: "Educación", subtitle: "Academia", gradient: "from-[#035AA6] to-[#11B4D9]", icon: GraduationCap },
  ];

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Diseñado para Todo Tipo de Empresas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EMMA se adapta perfectamente a las necesidades de diferentes industrias y tamaños de empresa
          </p>
        </div>

        {/* Grid de tipos de empresas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
          {industries.map((it) => (
            <IndustryTile key={it.title} {...it} />
          ))}
        </div>

        {/* Características clave */}
        <div className="bg-white rounded-3xl shadow-xl p-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              gradient="from-[#035AA6] to-[#07598C]"
              title="Máxima Seguridad"
              desc="Desarrollado con estándares de seguridad empresarial y cumplimiento de normativas"
              icon={ShieldCheck}
            />
            <FeatureCard
              gradient="from-[#11B4D9] to-[#07598C]"
              title="Nube Confiable"
              desc="Infraestructura Azure con 99.9% de disponibilidad y respaldo automático"
              icon={Cloud}
            />
            <FeatureCard
              gradient="from-[#038C7F] to-[#11B4D9]"
              title="Totalmente Escalable"
              desc="Crece con tu empresa, desde 10 hasta 10,000+ empleados sin complicaciones"
              icon={Expand}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryTile({ title, subtitle, gradient, icon: Icon }: { title: string; subtitle: string; gradient: string; icon: React.ComponentType<any> }) {
  return (
    <div className="flex flex-col items-center group p-1">
      <div className={`w-18 h-18 bg-linear-to-br ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 text-center">{title}</h3>
      <p className="text-xs text-gray-600 text-center">{subtitle}</p>
    </div>
  );
}

function FeatureCard({ gradient, title, desc, icon: Icon }: { gradient: string; title: string; desc: string; icon: React.ComponentType<any> }) {
  return (
    <div className="text-center">
      <div className="p-8">
        <div className={`w-16 h-16 bg-linear-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
