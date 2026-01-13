// app/roadmap/page.tsx
import React from "react";
import {
  Map,
  Circle,
  CheckCircle2,
  Cog,
  Rocket,
  Star,
  Database,
  Cloud,
  Shield,
  Atom,
  Users,
  Banknote,
  Clock,
  Search,
  CheckCircle,
} from "lucide-react";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-[#11B4D9]/10">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Map className="mr-2 h-4 w-4" />
            Roadmap de Desarrollo
          </div>
          <h1 className="text-5xl font-bold mb-6">
            El Futuro de{" "}
            <span className="bg-linear-to-r from-[#11B4D9] to-[#038C7F] bg-clip-text text-transparent">
              EMMA
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Descubre las funcionalidades que estamos desarrollando y cómo EMMA evolucionará para convertirse en la plataforma de RRHH más completa del mercado.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#038C7F] mr-2" />
              <span>Completado</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-400 mr-2 animate-pulse" />
              <span>En Desarrollo</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#07598C] mr-2" />
              <span>Planificado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Tecnológico */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">Stack Tecnológico</h2>
            <p className="text-lg text-gray-600">
              Construido con las mejores tecnologías para garantizar escalabilidad y rendimiento
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-linear-to-br from-[#035AA6]/10 to-[#07598C]/10 rounded-xl border border-[#035AA6]/30">
              <div className="w-16 h-16 bg-[#035AA6] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="text-white h-8 w-8" />
              </div>
              <h3 className="font-bold text-[#035AA6] mb-2">SQL Server</h3>
              <p className="text-sm text-[#07598C]">Base de datos robusta y escalable</p>
            </div>

            <div className="text-center p-6 bg-linear-to-br from-[#11B4D9]/10 to-[#038C7F]/10 rounded-xl border border-[#11B4D9]/30">
              <div className="w-16 h-16 bg-[#11B4D9] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Cloud className="text-white h-8 w-8" />
              </div>
              <h3 className="font-bold text-[#11B4D9] mb-2">Azure Functions</h3>
              <p className="text-sm text-[#07598C]">Backend serverless con .NET</p>
            </div>

            <div className="text-center p-6 bg-linear-to-br from-[#038C7F]/10 to-[#035AA6]/10 rounded-xl border border-[#038C7F]/30">
              <div className="w-16 h-16 bg-[#038C7F] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Atom className="text-white h-8 w-8" />
              </div>
              <h3 className="font-bold text-[#038C7F] mb-2">React</h3>
              <p className="text-sm text-[#07598C]">Frontend moderno y reactivo</p>
            </div>

            <div className="text-center p-6 bg-linear-to-br from-[#07598C]/10 to-[#11B4D9]/10 rounded-xl border border-[#07598C]/30">
              <div className="w-16 h-16 bg-[#07598C] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="font-bold text-[#07598C] mb-2">Azure Security</h3>
              <p className="text-sm text-[#035AA6]">Seguridad empresarial integrada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline de Desarrollo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0D0D0D] mb-4">Fases de Desarrollo</h2>
            <p className="text-xl text-gray-600">
              Nuestro plan estructurado para construir el mejor sistema de RRHH
            </p>
          </div>

          <div className="relative">
            {/* Línea vertical del timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-linear-to-b from-[#038C7F] via-amber-400 to-[#07598C]" />

            {/* Fase 1 */}
            <div className="relative mb-16">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-[#038C7F] rounded-xl flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-[#038C7F]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-[#0D0D0D]">
                      Fase 1: Infraestructura y Fundamentos
                    </h3>
                    <span className="bg-[#038C7F]/10 text-[#038C7F] px-3 py-1 rounded-full text-sm font-medium">
                      Completado
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Establecimiento de la arquitectura base y componentes fundamentales del sistema.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">Completado</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {[
                          "Configuración de Azure Infrastructure",
                          "Base de datos SQL Server",
                          "Azure Functions con .NET",
                          "Sistema de autenticación",
                          "API REST básica",
                        ].map((item) => (
                          <li key={item} className="flex items-center">
                            <CheckCircle className="text-[#038C7F] mr-2 h-4 w-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🎯 Entregables</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Arquitectura cloud-native escalable</li>
                        <li>• Sistema de autenticación seguro</li>
                        <li>• Base de datos optimizada</li>
                        <li>• CI/CD pipeline configurado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fase 2 */}
            <div className="relative mb-16">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10 animate-pulse">
                  <Cog className="h-8 w-8" />
                </div>

                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-[#0D0D0D]">Fase 2: Módulos Core de RRHH</h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      En Desarrollo - 65%
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Desarrollo de las funcionalidades fundamentales para la gestión de recursos humanos.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🔄 En Desarrollo</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {[
                          "Gestión de empleados",
                          "Estructura organizacional",
                          "Sistema de nóminas",
                          "Control de asistencia",
                          "Gestión de vacaciones",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center">
                            <Circle className="mr-2 h-3 w-3 text-amber-500 fill-amber-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🎯 Próximos Hitos</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Dashboard ejecutivo</li>
                        <li>• Reportes básicos</li>
                        <li>• Gestión de permisos</li>
                        <li>• Interfaz mobile-responsive</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-800">Progreso de la Fase</span>
                      <span className="text-sm font-medium text-amber-800">65%</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fase 3 */}
            <div className="relative mb-16">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-[#11B4D9] rounded-xl flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10">
                  <Rocket className="h-8 w-8" />
                </div>

                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-[#11B4D9]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-[#0D0D0D]">Fase 3: Funcionalidades Avanzadas</h3>
                    <span className="bg-[#11B4D9]/10 text-[#11B4D9] px-3 py-1 rounded-full text-sm font-medium">
                      Q4 2025
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Implementación de herramientas avanzadas de gestión y automatización.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🔮 Planificado</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {[
                          "Automatización de procesos",
                          "Analytics y KPIs avanzados",
                          "Gestión de performance",
                          "Plataforma de capacitación",
                          "Reclutamiento inteligente",
                        ].map((item) => (
                          <li key={item} className="flex items-center">
                            <CheckCircle className="text-[#11B4D9] mr-2 h-4 w-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🎯 Objetivos</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• IA para recomendaciones</li>
                        <li>• Integración con redes sociales</li>
                        <li>• Workflows personalizables</li>
                        <li>• API para terceros</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fase 4 */}
            <div className="relative mb-4">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-[#07598C] rounded-xl flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10">
                  <Star className="h-8 w-8" />
                </div>

                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-[#07598C]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-[#0D0D0D]">Fase 4: Optimización y Lanzamiento</h3>
                    <span className="bg-[#07598C]/10 text-[#07598C] px-3 py-1 rounded-full text-sm font-medium">
                      Q1 2026
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Pruebas, optimización y lanzamiento oficial de la plataforma.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🎯 Lanzamiento</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {[
                          "Beta testing extensivo",
                          "Optimización de rendimiento",
                          "Aplicación móvil nativa",
                          "Centro de soporte",
                          "Lanzamiento comercial",
                        ].map((item) => (
                          <li key={item} className="flex items-center">
                            <CheckCircle className="text-[#07598C] mr-2 h-4 w-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0D0D0D] mb-3">🎯 Meta Final</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Plataforma 100% funcional</li>
                        <li>• Documentación completa</li>
                        <li>• Onboarding automatizado</li>
                        <li>• Certificaciones de seguridad</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Detallados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0D0D0D] mb-4">Módulos del Sistema</h2>
            <p className="text-xl text-gray-600">
              Funcionalidades completas para la gestión integral de recursos humanos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gestión de Personal */}
            <div className="bg-linear-to-br from-[#035AA6]/10 to-[#11B4D9]/10 rounded-2xl p-8 border border-[#035AA6]/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#035AA6] rounded-lg flex items-center justify-center mr-4">
                  <Users className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#035AA6]">Gestión de Personal</h3>
              </div>
              <ul className="space-y-3 text-[#07598C]">
                {[
                  "Expediente digital completo",
                  "Organigrama dinámico",
                  "Gestión de contratos",
                  "Evaluaciones de desempeño",
                  "Plan de carrera",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="text-[#038C7F] mr-3 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nómina y Compensaciones */}
            <div className="bg-linear-to-br from-[#038C7F]/10 to-[#11B4D9]/10 rounded-2xl p-8 border border-[#038C7F]/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#038C7F] rounded-lg flex items-center justify-center mr-4">
                  <Banknote className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#038C7F]">Nómina y Compensaciones</h3>
              </div>
              <ul className="space-y-3 text-[#07598C]">
                {[
                  "Cálculo automático de nómina",
                  "Gestión de deducciones",
                  "Reportes fiscales",
                  "Bonificaciones variables",
                  "Integración bancaria",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="text-[#038C7F] mr-3 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiempo y Asistencia */}
            <div className="bg-linear-to-br from-[#11B4D9]/10 to-[#07598C]/10 rounded-2xl p-8 border border-[#11B4D9]/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#11B4D9] rounded-lg flex items-center justify-center mr-4">
                  <Clock className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#11B4D9]">Tiempo y Asistencia</h3>
              </div>
              <ul className="space-y-3 text-[#07598C]">
                {[
                  "Control de horarios",
                  "Gestión de ausencias",
                  "Solicitud de vacaciones",
                  "Horas extras automáticas",
                  "Reportes de productividad",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="text-[#11B4D9] mr-3 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reclutamiento y Selección */}
            <div className="bg-linear-to-br from-[#07598C]/10 to-[#038C7F]/10 rounded-2xl p-8 border border-[#07598C]/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#07598C] rounded-lg flex items-center justify-center mr-4">
                  <Search className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#07598C]">Reclutamiento y Selección</h3>
              </div>
              <ul className="space-y-3 text-[#035AA6]">
                {[
                  "Portal de candidatos",
                  "ATS integrado",
                  "Evaluaciones técnicas",
                  "Videoentrevistas",
                  "Onboarding digital",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="text-[#07598C] mr-3 h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">¿Quieres ser parte de la evolución?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a nuestro programa de beta testing y obtén acceso anticipado a las nuevas funcionalidades de EMMA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              <Map className="mr-2 h-5 w-5" />
              Solicitar Demo
            </a>
            <a
              href="/careers"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              Únete al Equipo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
