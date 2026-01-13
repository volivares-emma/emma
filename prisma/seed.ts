// prisma/seed.ts
import { PrismaClient, Prisma } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {

  const isProduction = process.env.NODE_ENV === 'production';
  
  const hashedPassword = await bcrypt.hash('Password123$', 12);

  // En producción, solo crear el usuario admin
  if (isProduction) {
    const adminUser: Prisma.tbl_usersCreateInput = {
      username: 'victor.olivares',
      password: hashedPassword,
      role: 'admin' as const,
      first_name: 'Victor',
      last_name: 'Olivares',
      email: 'victor.olivares@emma.pe',
      is_active: true
    };

    await prisma.tbl_users.upsert({
      where: { username: adminUser.username },
      update: {},
      create: adminUser
    });

    console.log('Usuario administrador creado correctamente en producción');
    return; // Salir después de crear solo el usuario admin
  }

  // En desarrollo, crear todos los usuarios
  const users: Prisma.tbl_usersCreateInput[] = [
    {
      username: 'admin',
      password: hashedPassword,
      role: 'admin' as const,
      first_name: 'Administrador',
      last_name: 'Sistema',
      email: 'admin@emma.com',
      is_active: true
    },
    {
      username: 'victor.olivares',
      password: hashedPassword,
      role: 'admin' as const,
      first_name: 'Victor',
      last_name: 'Olivares',
      email: 'victor.olivares@emma.pe',
      is_active: true
    },
    {
      username: 'editor.test',
      password: hashedPassword,
      role: 'editor' as const,
      first_name: 'Editor',
      last_name: 'Contenido',
      email: 'editor@emma.com',
      is_active: true
    },
    {
      username: 'reader.test',
      password: hashedPassword,
      role: 'reader' as const,
      first_name: 'Lector',
      last_name: 'Sistema',
      email: 'reader@emma.com',
      is_active: true
    },
    {
      username: 'guest.test',
      password: hashedPassword,
      role: 'guest' as const,
      first_name: 'Usuario',
      last_name: 'Invitado',
      email: 'guest@emma.com',
      is_active: true,
    },
    {
      username: 'editor2.test',
      password: hashedPassword,
      role: 'editor' as const,
      first_name: 'Editor',
      last_name: 'Dos',
      email: 'editor2@emma.com',
      is_active: true
    },
    {
      username: 'guest2.test',
      password: hashedPassword,
      role: 'guest' as const,
      first_name: 'Invitado',
      last_name: 'Dos',
      email: 'guest2@emma.com',
      is_active: true
    }
  ]

  // Crear usuarios
  for (const user of users) {
    await prisma.tbl_users.upsert({
      where: { username: user.username },
      update: {},
      create: user
    })
  }

  console.log('Usuarios de desarrollo sembrados correctamente')

  // En producción, solo crear usuario admin - no crear blogs ni slides
  if (isProduction) {
    return;
  }

  // Crear entradas de blog (solo en desarrollo)
  const blogEntries = [
    {
      title: 'Automatización de Nóminas: El Cambio que tu Departamento de RRHH Necesita',
      description: 'Descubre cómo automatizar nóminas puede transformar tu departamento de RRHH. Guía completa sobre beneficios, implementación y mejores prácticas.',
      content: `La gestión manual de nóminas es uno de los dolores de cabeza más grandes en departamentos de RRHH. Entre cálculos de descuentos, impuestos, beneficios y validaciones, los profesionales de recursos humanos pierden horas en tareas repetitivas que podrían automatizarse.

      Según nuestro análisis interno, **80% del tiempo invertido en nóminas es en procesos administrativos que no generan valor estratégico**. ¿Resultado? Equipos sobrecargados, errores humanos y cero tiempo para iniciativas de engagement o desarrollo de talento.

      La solución: automatización inteligente.

      ## ¿Por Qué Automatizar Nóminas?

      **1. Reducción de Errores Humanos**
      Los errores en nómina no solo son costosos, son criminales. Un cálculo erróneo en descuentos o beneficios puede generar conflictos laborales, multas regulatorias y pérdida de confianza. La automatización elimina variables humanas y garantiza precisión 100%.

      **2. Cumplimiento Normativo Automático**
      Las regulaciones laborales cambian constantemente. Sistemas manuales no se adaptan. EMMA actualiza automáticamente tablas impositivas, límites de seguridad social y beneficios según la normativa vigente. Cero preocupaciones por incumplimientos.

      **3. Tiempo que Recuperas**
      Si tu equipo dedica 40 horas mensuales a nómina, eso son 480 horas anuales. Con automatización, ese tiempo baja a 8-10 horas. **¿Qué harías con 470 horas extra?** Desarrollar estrategias de retención, crear programas de engagement, analizar datos de talento.

      ## Conclusión

      La automatización de nóminas no es lujo, es necesidad. En 2025, cualquier empresa que aún gestiona nóminas manualmente está perdiendo dinero, tiempo y oportunidad de crecer estratégicamente.

      EMMA convierte la nómina de tu mayor dolor de cabeza en tu mayor ventaja competitiva.`,
      author_id: 1, // admin
      slug: 'automatizacion-nominas-era-digital',
      status: 'published' as const
    },
    {
      title: 'Cultura Organizacional Remote-First: Construyendo Conexión en la Distancia',
      description: 'Herramientas, estrategias y mejores prácticas para fortalecer cultura empresarial en equipos 100% remotos o híbridos. Engagement real en la era del trabajo distribuido.',
      content: `La pandemia aceleró lo inevitable: el futuro del trabajo es distribuido. Pero aquí está el dilema: **¿Cómo construyes cultura organizacional cuando tus empleados nunca se ven en persona?**

      Muchas empresas creyeron que el home office era temporal. Hoy, 3 años después, la realidad es diferente:
      - 72% de profesionales prefiere modalidad remota o híbrida
      - La retención en equipos remotos bien gestionados es 41% más alta
      - Pero la soledad y desconexión son los mayores riesgos de equipos distribuidos

      ## Los 5 Pilares de Cultura Remote-First

      **1. Comunicación Unificada (No Fragmentada)**

      El caos en equipos remotos viene de tener 5 canales de comunicación: Slack, Email, Teams, WhatsApp, Zoom.

      **Solución:** Una plataforma centralizada con notificaciones inteligentes, canales segmentados pero conectados, feedback bidireccional en tiempo real.

      **2. Reconocimiento Peer-to-Peer**

      El reconocimiento es el combustible de la motivación. En EMMA diseñamos sistemas donde cualquiera puede reconocer a cualquiera, los reconocimientos se visualizan en dashboard del equipo y se acumulan para bonificaciones.

      ## Conclusión

      La cultura organizacional remote-first no es debilitada ni degradada. Es *diferente*. Y cuando se diseña intencionalmente, puede ser más fuerte que la de oficina.

      En EMMA estamos construyendo las herramientas para que lo hagas bien.`,
      author_id: 2, // victor.olivares
      slug: 'cultura-organizacional-remote-first',
      status: 'published' as const
    },
    {
      title: 'IA Predictiva: La Herramienta que Anticipará la Rotación de tu Talento Clave',
      description: 'Descubre cómo la IA identifica señales tempranas de rotación. Retén talento clave con predicciones 94% precisas antes de que sea demasiado tarde.',
      content: `Un empleado presenta su renuncia. Tu jefe dice: "Esto fue de sorpresa."

      Pero no fue. Estaban claras las señales:
      - Llevaba 6 meses sin aumento
      - Sus últimas 2 evaluaciones fueron regulares
      - Hace 3 meses pidió home office full (señal de buscar otro trabajo)
      - Rechazó promoción hace 2 meses
      - Redujo participación en eventos de empresa

      **Problema:** Estos datos están en sistemas diferentes. Tu jefe no los ve conectados. Para cuando notas el patrón, el empleado ya puso el pie afuera.

      **Solución:** IA que conecta todos estos puntos automáticamente.

      ## Cómo Funciona IA Predictiva de Rotación

      EMMA recopila datos de:

      1. **Datos de Desempeño**: Evaluaciones trimestrales, Feedback 360, Calificación de competencias
      2. **Datos de Engagement**: Participación en eventos, Respuestas a encuestas de clima
      3. **Datos de Compensación**: Últimos aumentos de sueldo, Cumplimiento de beneficios
      4. **Comportamiento Digital**: Acceso a plataforma, Uso de herramientas

      ## Precisión: 94% en Predicción

      EMMA fue entrenado con datos históricos de 50+ empresas con una precisión general del 94%.

      ## Conclusión

      La rotación de talento no es accidente. Es oportunidad perdida de datos. Con IA predictiva, transformas sorpresas en anticipación, reactividad en proactividad.

      EMMA está aquí para ese futuro.`,
      author_id: 3, // editor.test
      slug: 'ia-predictiva-rotacion-personal',
      status: 'published' as const
    }
  ]

  // Crear entradas de blog
  for (const blog of blogEntries) {
    await prisma.tbl_blogs.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog
    })
  }

  console.log('Entradas de blog sembradas correctamente')

  // Crear slides para la página principal (solo en desarrollo)
  const slides = [
    {
      title: 'Gestión de RRHH de Nueva Generación',
      subtitle: 'Automatización inteligente que crece con tu empresa',
      description: 'EMMA combina lo mejor de la tecnología Azure con 500+ horas de desarrollo dedicadas. Desde pequeñas startups hasta grandes corporaciones: nómina automática, evaluaciones avanzadas, workflows personalizables y comunicación unificada. 80% menos tiempo en tareas administrativas. ¡Únete a los pioneros!',
      button_text: 'Solicitar Demo',
      button_link: '/contact',
      visual_type: 'dashboard' as const,
      is_active: true,
      sort_order: 1
    },
    {
      title: 'Revoluciona tu Gestión de RRHH',
      subtitle: 'De horas a minutos. De caos a claridad.',
      description: 'Nómina automática, evaluaciones 360°, onboarding inteligente y más. EMMA consolida todos tus procesos de RRHH en una plataforma segura, escalable y fácil de usar. 10K+ empleados soportados. 99.9% de disponibilidad en Azure. ¡Comienza hoy!',
      button_text: 'Ver Funcionalidades',
      button_link: '/about',
      visual_type: 'analytics' as const,
      is_active: true,
      sort_order: 2
    },
    {
      title: 'Tu Departamento de RRHH, Potenciado',
      subtitle: 'Tecnología Azure + Automatización Inteligente',
      description: 'Gestiona nóminas, beneficios, capacitación y cultura en un solo lugar. EMMA está diseñado con estándares empresariales de seguridad, comunicación unificada en tiempo real y herramientas para fomentar el crecimiento del talento. Sé pionero en la transformación digital de tu empresa.',
      button_text: 'Comenzar Ahora',
      button_link: '/contact',
      visual_type: 'innovation' as const,
      is_active: true,
      sort_order: 3
    },
    {
      title: 'Talento Humano, Gestionado Inteligentemente',
      subtitle: 'Automatización + Analytics + Engagement',
      description: 'EMMA integra administración, nómina, evaluaciones, reconocimiento y beneficios flexibles. Reduce procesos repetitivos, mejora el engagement con herramientas de clima organizacional y peer-to-peer, y escala sin límites. Infraestructura Azure para máxima confiabilidad.',
      button_text: 'Conoce más',
      button_link: '/about',
      visual_type: 'team' as const,
      is_active: true,
      sort_order: 4
    },
    {
      title: 'La Plataforma que tu Equipo de RRHH Merece',
      subtitle: 'Menos burocracia, más impacto estratégico',
      description: 'Olvida las hojas de cálculo. EMMA automatiza nóminas, gestiona beneficios, facilita onboarding y fomenta una cultura organizacional sólida. Con soporte 24/7, seguridad empresarial y capacidad para 10K+ empleados, EMMA es la solución completa que estabas buscando.',
      button_text: 'Únete al Beta',
      button_link: '/contact',
      visual_type: 'growth' as const,
      is_active: false, // Slide secundario
      sort_order: 5
    }
  ]

  // Crear slides
  for (const slide of slides) {
    await prisma.tbl_slides.upsert({
      where: { id: slide.sort_order }, // Usar sort_order como identificador único
      update: {},
      create: slide
    })
  }

  console.log('Slides sembrados correctamente (solo en desarrollo)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
