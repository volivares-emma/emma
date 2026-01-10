// app/contact/page.tsx
"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
// import { createContact } from "@/api/contacts.api";
import { motion, useReducedMotion } from "framer-motion";
import type { ContactCreatePayload } from "@/types/contact";
import { toast } from "sonner";
import {
  Headset,
  CalendarDays,
  Phone,
  ChevronDown,
  Handshake,
  Mail,
  PhoneCall,
  Globe,
  MapPin,
  Clock,
  CheckCircle2,
  Tag,
  User,
  Building2,
  MessageSquare,
  Send,
  Shield,
  Video,
  ExternalLink,
} from "lucide-react";

// ===== Framer Motion variants =====
const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    const formData = new FormData(formRef.current);
    const contactData: ContactCreatePayload = {
      name: String(formData.get("nombre") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("telefono") || ""),
      company: String(formData.get("empresa") || ""),
      subject: String(formData.get("asunto") || ""),
      message: String(formData.get("mensaje") || ""),
    };
    fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Error en el envío");
        toast.success("¡Mensaje enviado!", {
          description: "Nos pondremos en contacto contigo pronto.",
        });
        formRef.current?.reset();
      })
      .catch(() => {
        toast.error("No pudimos procesar tu solicitud.", {
          description: "Intenta nuevamente o verifica tus datos.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main>
      {/* Hero Section */}
      <motion.section
        initial={{ backgroundPosition: "0% 50%" }}
        animate={
          prefersReducedMotion
            ? {}
            : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
        }
        transition={
          prefersReducedMotion
            ? {}
            : { duration: 8, ease: "easeInOut", repeat: Infinity }
        }
        className="relative overflow-hidden text-white py-20"
        style={{
          background:
            "linear-gradient(135deg, #035AA6 0%, #07598C 25%, #00262e 50%, #033e8c 75%, #0D0D0D 100%)",
          backgroundSize: "400% 400%",
        }}
      >
        {/* BG decor con Motion */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
            animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-48 h-48 bg-[#11B4D9]/10 rounded-full blur-2xl"
            animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-40 h-40 bg-[#038C7F]/10 rounded-full blur-xl"
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <Headset className="mr-2 h-4 w-4 text-[#11B4D9]" />
            <span>Soporte 24/7 Disponible</span>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
          >
            Contacta con{" "}
            <span className="bg-linear-to-r from-[#11B4D9] to-[#038C7F] bg-clip-text text-transparent">
              EMMA
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            Transformemos juntos la gestión de recursos humanos de tu empresa.{" "}
            <br className="hidden md:block" />
            <span className="text-[#11B4D9] font-medium">
              Agenda una demostración personalizada
            </span>{" "}
            y descubre el futuro de RRHH.
          </motion.p>

          {/* Stats con stagger */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { v: "24h", k: "Tiempo de respuesta", c: "text-[#11B4D9]" },
              { v: "100+", k: "Empresas interesadas", c: "text-[#038C7F]" },
              { v: "15min", k: "Demo personalizada", c: "text-[#11B4D9]" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className={`text-3xl font-bold ${s.c} mb-2`}>{s.v}</div>
                <div className="text-blue-200 text-sm">{s.k}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs con hover/tap */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="#contact-form"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-r from-[#11B4D9] to-[#038C7F] text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center shadow-xl"
            >
              <CalendarDays className="mr-3 h-5 w-5" />
              Agendar Demo Gratuita
            </motion.a>

            <motion.a
              href="#contact-info"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-[#11B4D9]/50 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#11B4D9]/10 transition-all flex items-center backdrop-blur-sm"
            >
              <Phone className="mr-3 h-5 w-5" />
              Llamar Ahora
            </motion.a>
          </div>
        </div>

        {/* Chevron con bounce Motion (sin keyframes) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/60 h-6 w-6" />
        </motion.div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Información de contacto */}
          <div id="contact-info" className="space-y-8">
            <motion.div
              className="bg-linear-to-br from-[#11B4D9]/10 to-[#038C7F]/10 rounded-2xl p-8 border border-[#11B4D9]/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeLeft}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-6 flex items-center">
                <Handshake className="text-[#035AA6] mr-3 h-6 w-6" />
                Hablemos de tu proyecto
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestro equipo de expertos está listo para ayudarte a
                implementar la solución de RRHH perfecta para tu organización.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#11B4D9]/10 border border-[#11B4D9]/30 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="text-[#035AA6] h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D0D0D]">Email</p>
                    <a
                      href="mailto:info@emma.pe"
                      className="text-[#035AA6] hover:text-[#07598C]"
                    >
                      info@emma.pe
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#038C7F]/10 border border-[#038C7F]/30 rounded-lg flex items-center justify-center mr-4">
                    <PhoneCall className="text-[#038C7F] h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D0D0D]">Teléfono</p>
                    <a
                      href="tel:+51987654321"
                      className="text-gray-600 hover:text-[#035AA6]"
                    >
                      +51 987 654 321
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#11B4D9]/10 border border-[#11B4D9]/30 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="text-[#07598C] h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D0D0D]">Sitio Web</p>
                    <a
                      href="https://descubre.emma.pe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#035AA6] hover:text-[#07598C]"
                    >
                      descubre.emma.pe
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#07598C]/10 border border-[#07598C]/30 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="text-[#07598C] h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D0D0D]">Ubicación</p>
                    <p className="text-gray-600">Lima, Perú</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Horarios y respuesta */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-[#11B4D9]/20 p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeRight}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <h3 className="text-xl font-bold text-[#0D0D0D] mb-6 flex items-center">
                <Clock className="text-[#038C7F] mr-3 h-5 w-5" />
                Horarios de atención
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#11B4D9]/10">
                  <span className="font-medium text-[#0D0D0D]">
                    Lunes - Viernes
                  </span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#11B4D9]/10">
                  <span className="font-medium text-[#0D0D0D]">Sábados</span>
                  <span className="text-gray-600">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-[#0D0D0D]">Domingos</span>
                  <span className="text-gray-600">Cerrado</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#038C7F]/10 rounded-lg border border-[#038C7F]/30">
                <div className="flex items-center">
                  <CheckCircle2 className="text-[#038C7F] mr-2 h-5 w-5" />
                  <span className="text-[#038C7F] font-medium">
                    Respuesta garantizada en 24 horas
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Formulario de contacto */}
          <motion.div
            id="contact-form"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold text-[#0D0D0D] mb-2 flex items-center">
              <Send className="text-[#035AA6] mr-3 h-6 w-6" />
              Envíanos un mensaje
            </h2>
            <p className="text-gray-600 mb-8">
              Completa el formulario y nos pondremos en contacto contigo lo
              antes posible.
            </p>

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="nombre"
                  >
                    <User className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="empresa"
                  >
                    <Building2 className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="email"
                  >
                    <Mail className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                    htmlFor="telefono"
                  >
                    <Phone className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                    placeholder="+51 987 654 321"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                  htmlFor="asunto"
                >
                  <Tag className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                  Asunto
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                  required
                >
                  <option value="">Selecciona un tema</option>
                  <option value="demo">Solicitar demostración</option>
                  <option value="precios">Información de precios</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="integracion">Integración con sistemas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-left font-semibold mb-2 text-[#0D0D0D]"
                  htmlFor="mensaje"
                >
                  <MessageSquare className="inline mr-2 h-4 w-4 text-[#035AA6]" />
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  className="w-full border border-[#11B4D9]/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#11B4D9] focus:border-[#11B4D9] transition-colors bg-white"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white font-bold py-4 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <Send className="h-5 w-5 shrink-0 relative -top-px" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              className="mt-8 p-4 bg-[#11B4D9]/10 rounded-lg border border-[#11B4D9]/30"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start">
                <Shield className="text-[#035AA6] mt-1 mr-3 h-5 w-5" />
                <div>
                  <p className="text-[#035AA6] font-medium text-sm">
                    Política de privacidad
                  </p>
                  <p className="text-[#07598C] text-xs mt-1">
                    Tu información está protegida y solo será utilizada para
                    responder a tu consulta.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA adicional */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Necesitas una respuesta inmediata?
            </h3>
            <p className="text-cyan-100 mb-6">
              Programa una videollamada con nuestro equipo y resuelve todas tus
              dudas en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@emma.pe?subject=Solicitud de videollamada"
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors inline-flex items-center justify-center"
              >
                <Video className="mr-2 h-5 w-5" />
                Agendar videollamada
              </a>
              <a
                href="https://emmahr.net"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-cyan-600 transition-colors inline-flex items-center justify-center"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Ver demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
