// app/careers/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Rocket,
  CheckCircle2,
  Star,
  BriefcaseBusiness,
  Building2,
  Clock,
  GraduationCap,
  Heart,
  Scale,
  Code,
  Smartphone,
  User,
  Mail,
  Phone,
  FileUp,
  SendHorizonal,
  Shield,
  ArrowRight,
} from "lucide-react";
import type {
  Recruitment,
  RecruitmentCreatePayload,
} from "@/types/recruitment";
import type { JobPosition } from "@/types/job-positions";
import { toast } from "sonner";

export default function CareersPage() {
  // Formulario de aplicación
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  // Eliminamos el estado de alert, ahora usamos Sonner
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [showOtherPosition, setShowOtherPosition] = useState(false);

  useEffect(() => {
    // Cargar posiciones de trabajo activas
    fetch("/api/job-positions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Job positions data:", data);
        setJobPositions(data.data || []);
      })
      .catch((error) => {
        console.error("Error loading job positions:", error);
        setJobPositions([]);
      });
  }, []);

  // Manejo de archivo CV
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setCvError("Formato no permitido. Solo PDF, DOC o DOCX.");
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("El archivo supera el tamaño máximo de 5MB.");
      setCvFile(null);
      return;
    }
    setCvFile(file);
    setCvError("");
  };

  // Función para subir archivo
  const uploadFile = async (recruitmentId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("related_type", "recruitment");
      formData.append("related_id", recruitmentId.toString());

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al subir archivo");
    } catch (error) {
      console.error("uploadFile error:", error);
      toast.error("No se pudo subir el archivo del candidato");
    }
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    
    if (!cvFile) {
      setCvError("Debes subir tu CV.");
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);
    
    // Obtener la posición seleccionada
    const selectedPosition = String(formData.get("posicion") || "");
    const otherPosition = String(formData.get("otraposicion") || "");
    const positionId = selectedPosition === "other" || selectedPosition === "" ? undefined : Number(selectedPosition);
    
    // Encontrar el job position seleccionado para obtener su título
    const selectedJobPosition = positionId ? jobPositions.find(jp => jp.id === positionId) : null;
    
    // Determinar el nombre de la posición
    let positionName = "";
    if (selectedJobPosition) {
      positionName = selectedJobPosition.title;
    } else if (selectedPosition === "other" && otherPosition.trim()) {
      positionName = otherPosition.trim();
    } else {
      positionName = "Posición no especificada";
    }
    
    // Construir el payload según RecruitmentCreatePayload
    const payload: RecruitmentCreatePayload = {
      name: String(formData.get("nombre") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("telefono") || ""),
      position: positionName,
      experience: String(formData.get("experiencia") || ""),
      salaryExpectation: String(formData.get("salario") || ""),
      coverLetter: String(formData.get("carta") || ""),
      // Solo asignar positionId si seleccionó una posición específica del sistema
      positionId: positionId,
    };

    try {
      const res = await fetch("/api/recruitments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar la aplicación");
      
      const savedRecruitment = await res.json();

      // Subir el archivo CV
      if (cvFile) {
        await uploadFile(savedRecruitment.id, cvFile);
      }

      toast.success("¡Aplicación enviada!", {
        description: "Nos pondremos en contacto contigo pronto.",
      });
      
      formRef.current.reset();
      setCvFile(null);
      setCvError("");
      setShowOtherPosition(false);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error("No pudimos procesar tu solicitud.", {
        description: err?.message || "Intenta nuevamente o verifica tus datos.",
      });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Únete al equipo <span className="text-[#11B4D9]">EMMA</span>
          </h1>
          <p className="text-xl mb-8 max-w-4xl mx-auto text-white/90">
            Construye el futuro de los recursos humanos con nosotros.
            Actualmente tenemos posiciones disponibles para desarrolladores
            especializados en tecnologías móviles.
          </p>
          <div className="flex justify-center items-center gap-3 flex-wrap text-sm">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Lima, Perú</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Trabajo remoto/híbrido</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Rocket className="mr-2 h-4 w-4 text-[#11B4D9]" />
              <span>Crecimiento profesional</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Posiciones Disponibles */}
        {Array.isArray(jobPositions) &&
        jobPositions.filter((jp) => jp.isActive).length > 0 ? (
          <div className="mb-16">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-linear-to-r from-[#038C7F] to-[#11B4D9] text-white mb-6 shadow-lg">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {jobPositions.filter((jp) => jp.isActive)
                  .length === 1
                  ? "Posición Disponible"
                  : "Posiciones Disponibles"}
              </span>
              <h2 className="text-4xl font-bold text-[#0D0D0D] mb-6">
                Únete a nuestro equipo
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Descubre las oportunidades disponibles y forma parte de la
                transformación digital de RRHH en Perú.
              </p>
            </div>

            <div className="space-y-8 max-w-7xl mx-auto">
              {jobPositions
                .filter((jp) => jp.isActive)
                .map((jobPosition) => (
                  <div
                    key={jobPosition.id}
                    className="relative overflow-hidden bg-linear-to-br from-[#035AA6] via-[#07598C] to-[#11B4D9] rounded-3xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group"
                  >
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
                      <div className="absolute top-20 right-10 w-24 h-24 bg-white/50 rounded-full" />
                      <div className="absolute bottom-10 left-20 w-16 h-16 bg-white/30 rounded-full" />
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-16 translate-y-16" />
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-white/20 rotate-12" />
                      <div className="absolute top-3/4 left-0 right-0 h-px bg-white/15 -rotate-12" />
                    </div>

                    {/* Contenido principal */}
                    <div className="relative bg-white rounded-3xl p-8 m-0.5 backdrop-blur-sm">
                      {jobPosition.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <div className="inline-flex items-center bg-linear-to-r from-[#11B4D9] to-[#038C7F] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            <Star className="mr-1 h-3 w-3" />
                            Destacada
                          </div>
                        </div>
                      )}
                      <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Información de la posición */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-linear-to-br from-[#035AA6] to-[#07598C] rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                              <BriefcaseBusiness className="text-white h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-[#0D0D0D] mb-1">
                                {jobPosition.title}
                              </h3>
                              <p className="text-[#035AA6] font-semibold">
                                {jobPosition.department || "Tecnología"} • {jobPosition.location || "Lima, Perú"}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 text-lg leading-relaxed">
                            {jobPosition.description || "Únete a nuestro equipo y ayuda a transformar la gestión de recursos humanos con tecnología innovadora."}
                          </p>

                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center bg-[#035AA6]/10 text-[#035AA6] px-4 py-2 rounded-full text-sm font-medium">
                              <MapPin className="mr-2 h-4 w-4" />
                              {jobPosition.location || "Lima, Perú"}
                            </div>
                            <div className="flex items-center bg-[#038C7F]/10 text-[#038C7F] px-4 py-2 rounded-full text-sm font-medium">
                              <Clock className="mr-2 h-4 w-4" />
                              {jobPosition.employmentType || "Tiempo completo"}
                            </div>
                            <div className="flex items-center bg-[#07598C]/10 text-[#07598C] px-4 py-2 rounded-full text-sm font-medium">
                              <GraduationCap className="mr-2 h-4 w-4" />
                              {jobPosition.experienceMin ? `${jobPosition.experienceMin}+ años` : "Experiencia variable"}
                            </div>
                            {jobPosition.salaryMin && jobPosition.salaryMax && (
                              <div className="flex items-center bg-[#11B4D9]/10 text-[#11B4D9] px-4 py-2 rounded-full text-sm font-medium">
                                <Scale className="mr-2 h-4 w-4" />
                                S/ {jobPosition.salaryMin.toLocaleString()} - S/ {jobPosition.salaryMax.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="lg:col-span-1 flex justify-center lg:justify-end">
                          <a
                            href="#careerForm"
                            className="inline-flex items-center bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white font-bold py-4 px-8 rounded-2xl hover:from-[#07598C] hover:to-[#038C7F] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group"
                          >
                            <span className="mr-3">Aplicar ahora</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center">
            <div className="bg-linear-to-br from-[#11B4D9]/10 to-[#038C7F]/5 rounded-3xl p-8 max-w-2xl mx-auto border border-[#11B4D9]/20 shadow-lg">
              <Clock className="text-[#07598C] text-4xl mb-4 mx-auto" />
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-4">
                No hay posiciones disponibles actualmente
              </h2>
              <p className="text-gray-600">
                Estamos evaluando nuevas vacantes. Envíanos tu CV para futuras
                oportunidades.
              </p>
            </div>
          </div>
        )}

        {/* Información de la empresa y formulario */}
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Información de la empresa */}
          <div className="space-y-8">
            <div className="bg-linear-to-br from-[#035AA6]/5 via-[#11B4D9]/5 to-[#038C7F]/5 rounded-3xl p-8 shadow-xl border border-[#11B4D9]/20">
              <h2 className="text-3xl font-bold text-[#0D0D0D] mb-6 flex items-center">
                <Users className="text-[#035AA6] mr-3 h-7 w-7" />
                ¿Por qué trabajar en EMMA?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-linear-to-br from-[#038C7F] to-[#11B4D9] rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-lg">
                    <Rocket className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0D0D0D] mb-1">
                      Innovación constante
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Trabajamos con las últimas tecnologías para transformar
                      RRHH
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-linear-to-br from-[#035AA6] to-[#07598C] rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-lg">
                    <GraduationCap className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0D0D0D] mb-1">
                      Crecimiento profesional
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Planes de carrera claros y formación continua
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-linear-to-br from-[#07598C] to-[#11B4D9] rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-lg">
                    <Heart className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0D0D0D] mb-1">
                      Ambiente colaborativo
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Cultura de trabajo en equipo y respeto mutuo
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-linear-to-br from-[#11B4D9] to-[#038C7F] rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-lg">
                    <Scale className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0D0D0D] mb-1">
                      Work-life balance
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Flexibilidad horaria y trabajo remoto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border-2 border-[#11B4D9]/20 p-8">
              <h3 className="text-2xl font-bold text-[#0D0D0D] mb-6 flex items-center">
                <Code className="text-[#035AA6] mr-3 h-6 w-6" />
                Nuestro Enfoque de Desarrollo
              </h3>
              <div className="space-y-6 text-sm">
                <div className="flex items-start">
                  <Smartphone className="text-[#038C7F] mr-3 mt-1 h-5 w-5" />
                  <div>
                    <p className="font-medium text-[#0D0D0D] text-base">
                      Mobile First
                    </p>
                    <p className="text-gray-600">
                      Priorizamos apps móviles nativas
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="text-[#035AA6] mr-3 mt-1 h-5 w-5" />
                  <div>
                    <p className="font-medium text-[#0D0D0D] text-base">
                      Trabajo en Equipo
                    </p>
                    <p className="text-gray-600">
                      Colaboración entre devs y diseño
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Rocket className="text-[#07598C] mr-3 mt-1 h-5 w-5" />
                  <div>
                    <p className="font-medium text-[#0D0D0D] text-base">
                      Crecimiento Continuo
                    </p>
                    <p className="text-gray-600">
                      Aprendizaje de nuevas tecnologías
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de aplicación */}
          <div
            id="careerForm"
            className="bg-white rounded-3xl shadow-2xl border-2 border-[#11B4D9]/20 p-8"
          >
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-3 flex items-center">
              <BriefcaseBusiness className="text-[#035AA6] mr-3 h-7 w-7" />
              Aplica ahora
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Envíanos tu información y nos contactaremos contigo para conocer
              más sobre tu perfil.
            </p>

            <form
              ref={formRef}
              className="space-y-6"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Sonner muestra el feedback visual, no se requiere alert visual aquí */}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="nombre"
                  >
                    <User className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="email"
                  >
                    <Mail className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="telefono"
                  >
                    <Phone className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                    placeholder="+51 987 654 321"
                  />
                </div>
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="posicion"
                  >
                    <BriefcaseBusiness className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Posición de interés
                  </label>
                  <select
                    id="posicion"
                    name="posicion"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                    required
                    onChange={(e) => setShowOtherPosition(e.target.value === "other")}
                  >
                    <option value="">Selecciona una posición</option>
                    {Array.isArray(jobPositions) &&
                      jobPositions.map((position: JobPosition) => (
                        <option key={position.id} value={position.id}>
                          {position.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Campo adicional para otra posición */}
              {showOtherPosition && (
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="otraposicion"
                  >
                    <BriefcaseBusiness className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Especifica la posición
                  </label>
                  <input
                    type="text"
                    id="otraposicion"
                    name="otraposicion"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                    placeholder="Ej: Desarrollador Mobile React Native"
                    required={showOtherPosition}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="experiencia"
                  >
                    <GraduationCap className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Años de experiencia
                  </label>
                  <select
                    id="experiencia"
                    name="experiencia"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                  >
                    <option value="">Selecciona tu experiencia</option>
                    <option value="0-1">
                      Sin experiencia / Menos de 1 año
                    </option>
                    <option value="1-3">1-3 años</option>
                    <option value="3-5">3-5 años</option>
                    <option value="5-8">5-8 años</option>
                    <option value="8+">Más de 8 años</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="salario"
                  >
                    <Scale className="inline text-[#035AA6] mr-2 h-4 w-4" />
                    Expectativa salarial
                  </label>
                  <select
                    id="salario"
                    name="salario"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="2500-3500">S/ 2,500 - S/ 3,500</option>
                    <option value="3500-4500">S/ 3,500 - S/ 4,500</option>
                    <option value="4500-5500">S/ 4,500 - S/ 5,500</option>
                    <option value="5500-7000">S/ 5,500 - S/ 7,000</option>
                    <option value="7000+">S/ 7,000+</option>
                    <option value="negociable">A negociar</option>
                  </select>
                </div>
              </div>

              {/* Subir CV */}
              <div>
                <label
                  className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                  htmlFor="cv"
                >
                  <FileUp className="inline text-[#035AA6] mr-2 h-4 w-4" />
                  Curriculum Vitae *
                </label>
                <div className="relative border-2 border-dashed border-[#11B4D9]/40 rounded-xl p-6 hover:border-[#035AA6] transition-colors bg-linear-to-br from-[#11B4D9]/5 to-[#038C7F]/5">
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                    onChange={handleCvChange}
                  />
                  <div className="text-center" id="cvDisplay">
                    {!cvFile ? (
                      <div className="text-gray-500">
                        <FileUp className="text-[#07598C] mx-auto mb-3 h-10 w-10" />
                        <p className="font-medium text-[#0D0D0D]">
                          Arrastra tu CV aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm mt-1">
                          PDF, DOC o DOCX - Máximo 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-[#038C7F] flex items-center justify-center">
                        <CheckCircle2 className="mr-3 h-6 w-6" />
                        <div>
                          <p className="font-medium">{cvFile.name}</p>
                          <p className="text-sm">CV cargado correctamente</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {cvError && (
                  <div className="text-red-600 text-sm mt-2 flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{cvError}</span>
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                  htmlFor="carta"
                >
                  <Mail className="inline text-[#035AA6] mr-2 h-4 w-4" />
                  Carta de presentación
                </label>
                <textarea
                  id="carta"
                  name="carta"
                  rows={5}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#035AA6] focus:border-[#035AA6] transition-all"
                  placeholder="Cuéntanos sobre ti, tu experiencia y por qué te interesa trabajar en EMMA..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white font-bold py-4 px-6 rounded-xl hover:from-[#07598C] hover:to-[#038C7F] transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Enviar aplicación
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-6 bg-linear-to-r from-[#11B4D9]/10 to-[#038C7F]/10 rounded-xl border border-[#11B4D9]/30">
              <div className="flex items-start">
                <Shield className="text-[#035AA6] mt-1 mr-3 h-5 w-5" />
                <div>
                  <p className="text-[#0D0D0D] font-medium text-sm">
                    Política de privacidad
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Tu información será tratada de forma confidencial y solo se
                    usará para el proceso de selección.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
