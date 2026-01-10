'use client'

import React, { useRef } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  FileText,
  GraduationCap,
  Wrench,
  Lightbulb,
  Users,
  LifeBuoy,
  Download,
  Bell,
  Mail,
  Shield,
  Cog,
  Check,
  ExternalLink,
  UserPlus,
  Rocket,
  Send,
  Star,
  XCircle,
} from 'lucide-react'

const container = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, duration: 0.45 } },
}
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Resources() {

  const emailInputRef = useRef<HTMLInputElement>(null)

  const onSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') || '')
    if (!email) return
        fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: 'general', source: 'website' }),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al suscribirse')
            toast.success('¡Suscripción exitosa!', {
              description: 'Te avisaremos sobre nuevos recursos.'
            });
            if (emailInputRef.current) emailInputRef.current.value = ''
          })
          .catch(() => {
            toast.error('Error al suscribirse', {
              description: 'Intenta nuevamente o verifica tu correo.'
            })
          })
  }

  return (
    <section className="py-20 bg-linear-to-br from-[#11B4D9]/10 to-[#035AA6]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#11B4D9]/10 text-[#035AA6] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4 mr-2" /> Centro de Conocimiento
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recursos de RRHH en Desarrollo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos creando una biblioteca completa de herramientas, guías y recursos para revolucionar tu gestión de talento humano
          </p>
        </div>

        {/* Grid de recursos */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Doc Técnica */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-[#035AA6] to-[#11B4D9]"
              icon={<FileText className="w-7 h-7 text-white" />}
              title="Documentación Técnica"
              status={{ text: 'En construcción', color: 'text-[#035AA6]' }}
              description="Guías completas de implementación, APIs y mejores prácticas para maximizar el potencial de EMMA"
              bullets={[
                { icon: <Cog className="w-4 h-4 text-[#035AA6]" />, text: 'Guías de configuración' },
                { icon: <Cog className="w-4 h-4 text-[#035AA6]" />, text: 'Documentación de API' },
                { icon: <Cog className="w-4 h-4 text-[#035AA6]" />, text: 'Casos de uso empresariales' },
              ]}
              cta={{ href: '/docs', label: 'Acceso anticipado', icon: <ExternalLink className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>

          {/* Centro de Aprendizaje */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-[#11B4D9] to-[#07598C]"
              icon={<GraduationCap className="w-7 h-7 text-white" />}
              title="Centro de Aprendizaje"
              status={{ text: 'Planificado', color: 'text-[#11B4D9]' }}
              description="Cursos, webinars y certificaciones para profesionales de RRHH que quieren dominar las nuevas tecnologías"
              bullets={[
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Cursos de gestión moderna' },
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Webinars con expertos' },
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Certificaciones profesionales' },
              ]}
              cta={{ href: '/learning', label: 'Notificarme cuando esté listo', icon: <Bell className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>

          {/* Herramientas y Templates */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-[#038C7F] to-[#11B4D9]"
              icon={<Wrench className="w-7 h-7 text-white" />}
              title="Kit de Herramientas"
              status={{ text: 'Beta disponible', color: 'text-[#038C7F]' }}
              description="Templates, calculadoras y herramientas prácticas para optimizar tus procesos de RRHH desde el primer día"
              bullets={[
                { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: 'Templates de evaluación' },
                { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: 'Calculadora de nómina' },
                { icon: <Cog className="w-4 h-4 text-[#038C7F]" />, text: 'Generador de contratos' },
              ]}
              cta={{ href: '/tools', label: 'Descargar beta', icon: <Download className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>

          {/* Blog e Insights */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-amber-400 to-orange-400"
              icon={<Lightbulb className="w-7 h-7 text-white" />}
              title="Blog de Innovación"
              status={{ text: 'Activo', color: 'text-amber-500' }}
              description="Insights, tendencias y análisis profundos sobre el futuro del trabajo y la gestión de recursos humanos"
              bullets={[
                { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: 'Artículos semanales' },
                { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: 'Análisis de tendencias' },
                { icon: <Check className="w-4 h-4 text-[#038C7F]" />, text: 'Casos de estudio' },
              ]}
              cta={{ href: '/blog', label: 'Leer artículos', icon: <ExternalLink className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>

          {/* Comunidad */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-[#07598C] to-[#035AA6]"
              icon={<Users className="w-7 h-7 text-white" />}
              title="Comunidad de Pioneros"
              status={{ text: 'Invitación exclusiva', color: 'text-[#07598C]' }}
              description="Únete a profesionales de RRHH visionarios que están ayudando a definir el futuro de la gestión del talento"
              bullets={[
                { icon: <Cog className="w-4 h-4 text-[#07598C]" />, text: 'Foro privado de discusión' },
                { icon: <Cog className="w-4 h-4 text-[#07598C]" />, text: 'Sesiones de feedback' },
                { icon: <Cog className="w-4 h-4 text-[#07598C]" />, text: 'Influencia en desarrollo' },
              ]}
              cta={{ href: '/community', label: 'Solicitar invitación', icon: <UserPlus className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>

          {/* Soporte */}
          <motion.div variants={item}>
            <ResourceCard
              gradient="from-[#11B4D9] to-[#038C7F]"
              icon={<LifeBuoy className="w-7 h-7 text-white" />}
              title="Centro de Soporte"
              status={{ text: '24/7 planificado', color: 'text-[#11B4D9]' }}
              description="Soporte técnico especializado y consultoría estratégica para maximizar el valor de tu implementación"
              bullets={[
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Chat en tiempo real' },
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Consultoría estratégica' },
                { icon: <Cog className="w-4 h-4 text-[#11B4D9]" />, text: 'Onboarding personalizado' },
              ]}
              cta={{ href: '/support', label: 'Contactar equipo', icon: <Mail className="w-4 h-4 mr-2" /> }}
            />
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-linear-to-r from-blue-900 to-cyan-900 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">Mantente al Día con el Desarrollo</h3>
            <p className="text-xl text-[#D1ECF9] mb-8">
              Recibe actualizaciones exclusivas sobre nuevas funcionalidades, recursos y el progreso de EMMA
            </p>
            <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <Input ref={emailInputRef} type="email" name="email" placeholder="tu@empresa.com" className="text-gray-900 bg-white/95" required aria-label="Correo electrónico" />
              <Button type="submit" className="bg-gray-50 text-[#035AA6] hover:bg-amber-400 hover:text-[#0B1B2B]">
                <Send className="w-4 h-4 mr-2" /> Suscribirse
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-[#D1ECF9] text-sm">
              <div className="flex items-center"><Shield className="w-4 h-4 mr-2" /> Sin spam</div>
              <div className="flex items-center"><XCircle className="w-4 h-4 mr-2" /> Cancela cuando quieras</div>
              <div className="flex items-center"><Star className="w-4 h-4 mr-2" /> Contenido exclusivo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ResourceCard({
  gradient,
  icon,
  title,
  status,
  description,
  bullets,
  cta,
}: {
  gradient: string
  icon: React.ReactNode
  title: string
  status: { text: string; color: string }
  description: string
  bullets: { icon: React.ReactNode; text: string }[]
  cta: { href: string; label: string; icon?: React.ReactNode }
}) {
  return (
    <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#11B4D9]/10">
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
        <div className="space-y-2 mb-6">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-center text-sm text-gray-700">
              <span className="mr-2 flex items-center">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
        <Button asChild variant="link" className="px-0 h-auto text-[#035AA6] font-semibold hover:text-[#11B4D9]">
          <Link href={cta.href} className="inline-flex items-center">
            {cta.icon}
            {cta.label}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
