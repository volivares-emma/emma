// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Shield,
  LineChart,
  Users,
  Target,
  Eye,
  GraduationCap,
  Globe,
  Mail,
  Handshake,
  Plus,
  FileText,
  Settings,
  UserPlus,
  Rocket,
  Headphones,
} from "lucide-react";

export const metadata = {
  title: "Acerca de EMMA",
  description:
    "Conoce más sobre EMMA - Employee Management Monitoring & Administration. Tu solución integral para la gestión de recursos humanos.",
};

export default function AboutPage() {
  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Acerca de{" "}
            <span className="bg-linear-to-r from-[#11B4D9] to-[#038C7F] bg-clip-text text-transparent">
              EMMA
            </span>
          </h1>
          <p className="text-xl mb-8 max-w-4xl mx-auto text-white/90">
            <strong>Employee Management Monitoring & Administration</strong> –
            Tu solución integral para la gestión moderna de recursos humanos,
            diseñada para potenciar el talento y optimizar los procesos
            empresariales en la era digital.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Cloud className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Alojado en Azure</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Seguridad empresarial</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <LineChart className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>IA próximamente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Dashboard Demo Section */}
        <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 mb-16 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0D0D0D] mb-4">
              Plataforma Integral de{" "}
              <span className="text-[#035AA6]">RRHH</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre cómo EMMA revoluciona la gestión de recursos humanos con
              tecnología de vanguardia
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <Image
                src="/logo.png"
                alt="EMMA Logo"
                width={248}
                height={93}
                className="mx-auto md:mx-0 mb-6 drop-shadow-lg"
                priority
              />

              <p className="text-gray-700 mb-6 leading-relaxed">
                EMMA revoluciona la forma en que las empresas gestionan su
                capital humano, combinando tecnología de vanguardia con procesos
                intuitivos que simplifican desde la contratación hasta el
                desarrollo profesional de tus empleados.
              </p>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Nuestra plataforma, alojada en{" "}
                <span className="font-semibold text-[#035AA6]">
                  Microsoft Azure
                </span>
                , garantiza la máxima seguridad y escalabilidad, mientras que
                nuestras funciones de inteligencia artificial (próximamente)
                transformarán la toma de decisiones estratégicas en recursos
                humanos.
              </p>

              <div className="bg-white rounded-xl p-4 border-l-4 border-[#035AA6] shadow-sm">
                <p className="text-gray-800 text-sm">
                  <span className="font-semibold text-[#035AA6]">
                    🚀 Actualmente disponible:
                  </span>{" "}
                  Gestión completa de empleados, nóminas automatizadas,
                  evaluaciones de desempeño y reportes en tiempo real.
                </p>
                <p className="text-gray-800 text-sm mt-2">
                  <span className="font-semibold text-[#038C7F]">
                    ⚡ Próximamente:
                  </span>{" "}
                  Análisis predictivo con IA, big data analytics y
                  automatización inteligente de procesos de selección.
                </p>
              </div>
            </div>

            {/* Dashboard Preview (LIGHT) */}
            <div className="w-full md:w-1/2">
              <div className="rounded-3xl p-6 shadow-xl overflow-hidden bg-white border border-slate-200">

                {/* Header */}
                <div className="z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-[#035AA6] to-[#11B4D9] rounded-xl flex items-center justify-center shadow">
                        <LineChart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg">
                          Dashboard EMMA
                        </h3>
                        <p className="text-[#035AA6] text-sm">
                          Panel Principal de RRHH
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-slate-500 text-xs">En vivo</span>
                    </div>
                  </div>

                  {/* Metrics (light cards) */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-sky-50 rounded-lg">
                          <Users className="w-5 h-5 text-[#035AA6]" />
                        </div>
                        <div className="text-emerald-600 text-xs font-semibold">
                          ↗ +5%
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs mb-1">
                        Empleados Activos
                      </div>
                      <div className="text-slate-900 text-xl font-bold">
                        1,247
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <UserPlus className="w-5 h-5 text-[#038C7F]" />
                        </div>
                        <div className="text-emerald-600 text-xs font-semibold">
                          ↗ +12
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs mb-1">
                        Este Mes
                      </div>
                      <div className="text-slate-900 text-xl font-bold">23</div>
                    </div>
                  </div>

                  {/* Progress Bars (light) */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 text-sm">
                          Procesamiento Nóminas
                        </span>
                        <span className="text-[#035AA6] text-sm font-semibold">
                          92%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] h-2 rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 text-sm">
                          Evaluaciones Pendientes
                        </span>
                        <span className="text-[#07598C] text-sm font-semibold">
                          67%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-teal-500 to-sky-500 h-2 rounded-full"
                          style={{ width: "67%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions (light) */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white hover:from-[#035AA6] hover:to-[#11B4D9]"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Nuevo
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Reportes
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      Config
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#11B4D9]/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-[#035AA6] mb-4">
              <Target className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Transformar la gestión de recursos humanos mediante tecnología
              innovadora que facilite la administración del talento, mejore la
              experiencia del empleado y optimice los procesos organizacionales.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#11B4D9]/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-[#038C7F] mb-4">
              <Eye className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">
              Nuestra Visión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ser la plataforma líder en gestión de recursos humanos, reconocida
              por su capacidad de adaptación, innovación tecnológica y
              compromiso con el desarrollo del capital humano.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-[#0D0D0D] mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-[#035AA6]/10 to-[#11B4D9]/10 rounded-3xl p-8 text-center border-2 border-[#11B4D9]/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="text-[#035AA6] mb-6 flex justify-center">
                <Users className="h-14 w-14" />
              </div>
              <h3 className="text-2xl font-semibold text-[#0D0D0D] mb-4">
                Gestión de Personal
              </h3>
              <p className="text-gray-600">
                Administración completa de empleados, desde reclutamiento hasta
                desarrollo profesional.
              </p>
            </div>

            <div className="bg-linear-to-br from-[#038C7F]/10 to-[#07598C]/10 rounded-3xl p-8 text-center border-2 border-[#038C7F]/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="text-[#038C7F] mb-6 flex justify-center">
                <LineChart className="h-14 w-14" />
              </div>
              <h3 className="text-2xl font-semibold text-[#0D0D0D] mb-4">
                Evaluaciones
              </h3>
              <p className="text-gray-600">
                Sistemas de evaluación de desempeño y seguimiento de objetivos
                empresariales.
              </p>
            </div>

            <div className="bg-linear-to-br from-[#07598C]/10 to-[#11B4D9]/10 rounded-3xl p-8 text-center border-2 border-[#07598C]/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="text-[#07598C] mb-6 flex justify-center">
                <GraduationCap className="h-14 w-14" />
              </div>
              <h3 className="text-2xl font-semibold text-[#0D0D0D] mb-4">
                Capacitación
              </h3>
              <p className="text-gray-600">
                Programas de formación y desarrollo continuo del talento humano.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] rounded-3xl p-8 md:p-12 text-white mb-16 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para transformar tu empresa?
            </h2>
            <p className="text-xl opacity-90">
              Contáctanos y descubre cómo EMMA puede revolucionar tu gestión de
              RRHH
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <Globe className="h-10 w-10 text-[#11B4D9]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sitio Web</h3>
              <Link
                href="https://descubre.emma.pe"
                className="text-white/80 hover:text-white transition-colors"
              >
                www.descubre.emma.pe
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <Mail className="h-10 w-10 text-[#11B4D9]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <Link
                href="mailto:info@emma.pe"
                className="text-white/80 hover:text-white transition-colors"
              >
                info@emma.pe
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <Handshake className="h-10 w-10 text-[#11B4D9]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Alianzas</h3>
              <p className="text-white/80">Socios estratégicos en RRHH</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              className="bg-white text-[#035AA6] font-semibold px-8 py-6 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <Link href="/contact">Contactar Ahora</Link>
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#11B4D9]/20">
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-8">
              ¿Por qué elegir EMMA?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="text-[#035AA6] mb-4 flex justify-center">
                  <Shield className="h-8 w-8 transition-transform group-hover:scale-110" />
                </div>
                <h4 className="font-semibold text-[#0D0D0D] mb-3 text-lg">
                  Seguridad
                </h4>
                <p className="text-sm text-gray-600">
                  Protección total de datos empresariales
                </p>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="text-[#038C7F] mb-4 flex justify-center">
                  <Rocket className="h-8 w-8 transition-transform group-hover:scale-110" />
                </div>
                <h4 className="font-semibold text-[#0D0D0D] mb-3 text-lg">
                  Innovación
                </h4>
                <p className="text-sm text-gray-600">
                  Tecnología de vanguardia en RRHH
                </p>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="text-[#07598C] mb-4 flex justify-center">
                  <Settings className="h-8 w-8 transition-transform group-hover:scale-110" />
                </div>
                <h4 className="font-semibold text-[#0D0D0D] mb-3 text-lg">
                  Personalización
                </h4>
                <p className="text-sm text-gray-600">Adaptable a tu empresa</p>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="text-[#11B4D9] mb-4 flex justify-center">
                  <Headphones className="h-8 w-8 transition-transform group-hover:scale-110" />
                </div>
                <h4 className="font-semibold text-[#0D0D0D] mb-3 text-lg">
                  Soporte 24/7
                </h4>
                <p className="text-sm text-gray-600">
                  Asistencia continua especializada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
