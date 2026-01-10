'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { LucideIcon } from 'lucide-react'
import type { JobPosition } from '@/types/job-positions'
import SkeletonCareers from '@/components/loading/skeleton-careers'
import { toast } from 'sonner'
import {
  Code,
  Paintbrush,
  Users,
  Megaphone,
  Handshake,
  Briefcase,
  Rocket,
  Bell,
  Home,
  LineChart,
  GraduationCap,
  Heart,
  ArrowRight,
  Search,
} from 'lucide-react'

// ---- Helpers
function getDepartmentIcon(department?: string): LucideIcon {
  switch ((department || '').toLowerCase()) {
    case 'desarrollo':
    case 'tecnología':
    case 'it':
      return Code
    case 'diseño':
    case 'ux':
    case 'ui':
      return Paintbrush
    case 'recursos humanos':
    case 'rrhh':
    case 'hr':
      return Users
    case 'marketing':
      return Megaphone
    case 'ventas':
      return Handshake
    default:
      return Briefcase
  }
}

function getDepartmentGradient(department?: string): string {
  switch ((department || '').toLowerCase()) {
    case 'desarrollo':
    case 'tecnología':
    case 'it':
      return 'from-[#035AA6] to-[#07598C]'
    case 'diseño':
    case 'ux':
    case 'ui':
      return 'from-[#07598C] to-[#11B4D9]'
    case 'recursos humanos':
    case 'rrhh':
    case 'hr':
      return 'from-[#038C7F] to-[#11B4D9]'
    case 'marketing':
      return 'from-[#11B4D9] to-[#038C7F]'
    case 'ventas':
      return 'from-[#035AA6] to-[#038C7F]'
    default:
      return 'from-[#0D0D0D] to-[#035AA6]'
  }
}

const container = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, duration: 0.45 },
  },
}

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function Careers() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([])
  const [loading, setLoading] = useState(true)
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/job-positions', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((payload) => {
        console.log("Data recibida:", payload)
        const rawJobPositions: JobPosition[] = payload.data || []
        setJobPositions(rawJobPositions)
      })
      .catch((error) => {
        setJobPositions([])
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [])

  const count = jobPositions.length
  let grid = 'grid gap-6 mb-12'
  if (count === 1) grid += ' max-w-md mx-auto'
  else if (count === 2) grid += ' grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
  else grid += ' md:grid-cols-2 lg:grid-cols-3'

  const onNotify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') || '')
    if (!email) return
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'career', source: 'website'})
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al suscribirse')
        toast.success('¡Suscripción exitosa!', {
          description: 'Te avisaremos sobre nuevas oportunidades.'
        })
        if (emailInputRef.current) emailInputRef.current.value = ''
      })
      .catch(() => {
        toast.error('Error al suscribirse', {
          description: 'Intenta nuevamente o verifica tu correo.'
        })
      })
  }

    if (loading) {
      return (
        <SkeletonCareers/>
      );
    }

  return (
    <section className="py-12 bg-linear-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
            <Rocket className="w-4 h-4 mr-2" /> Equipo en Crecimiento
          </div>
          <h2 className="text-3xl font-bold mb-3">Únete a la Revolución de RRHH</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Estamos buscando talento excepcional para construir el futuro de la gestión de recursos humanos
          </p>
        </div>

        {/* Grid de posiciones */}
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className={grid}>
          {jobPositions.length > 0
            ? jobPositions.map((r, idx) => {
                const Icon = getDepartmentIcon(r.department || undefined)
                const grad = getDepartmentGradient(r.department || undefined)
                return (
                  <motion.div key={idx} variants={item}>
                    <Card className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-linear-to-br ${grad} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg text-amber-500 font-bold">{r.title}</h3>
                            <span className="text-[#11B4D9] text-sm">{r.department } • {Array.isArray(r.requirements) ? r.requirements.join(' | ') : r.requirements || ''}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-3 text-sm line-clamp-2">
                          { r.description || 'Únete a nuestro equipo y contribuye al crecimiento de EMMA'}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="bg-[#035AA6]/20 text-[#11B4D9] px-2 py-1 rounded-full text-xs">{r.location || 'Remoto'}</span>
                          <span className="bg-[#038C7F]/20 text-[#11B4D9] px-2 py-1 rounded-full text-xs">{r.employmentType || 'Tiempo completo'}</span>
                          {r.isFeatured && (
                            <span className="bg-[#07598C]/20 text-[#11B4D9] px-2 py-1 rounded-full text-xs">Destacado</span>
                          )}
                        </div>

                        <Button asChild variant="link" className="px-0 h-auto text-amber-400 hover:text-amber-300 text-sm font-semibold">
                          <Link href={`/careers`} className="inline-flex items-center">
                            <ArrowRight className="w-4 h-4 mr-2" /> Más información
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            : (
              <div className="col-span-full text-center py-8">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No hay posiciones activas disponibles</h3>
                <p className="text-gray-400 text-sm">¡Mantente atento! Nuevas oportunidades se publican regularmente.</p>
              </div>
            )}
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-xl p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">¿Unirte a EMMA?</h3>
                <p className="text-amber-100 text-sm">Te notificaremos sobre nuevas oportunidades</p>
              </div>
            </div>

            <form onSubmit={onNotify} className="max-w-md mx-auto mb-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input ref={emailInputRef} type="email" name="email" placeholder="tu@email.com" required className="flex-1 bg-white/20 text-white placeholder-white/60 border-0 focus:bg-white/30 focus-visible:ring-white/50" />
                <Button type="submit" className="bg-white text-[#035AA6] hover:bg-gray-100 font-bold">
                  <Bell className="w-4 h-4 mr-2" /> Notificarme
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-amber-100 text-xs">
              <div className="flex items-center justify-center"><Home className="w-4 h-4 mr-1" /> Remoto</div>
              <div className="flex items-center justify-center"><LineChart className="w-4 h-4 mr-1" /> Equity</div>
              <div className="flex items-center justify-center"><GraduationCap className="w-4 h-4 mr-1" /> Crecimiento</div>
              <div className="flex items-center justify-center"><Heart className="w-4 h-4 mr-1" /> Innovación</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
