# EMMA - HR Software Platform

Sistema completo de gestión de recursos humanos construido con Next.js, TypeScript, Prisma y PostgreSQL.

## Estructura del Proyecto

```
web/                         # Repositorio principal
├── deploy/                  # Deploy y configuración de producción
│   ├── deploy.sh            # Deploy automático Linux/macOS
│   ├── deploy.bat           # Deploy automático Windows  
│   ├── maintenance.sh       # Herramientas de mantenimiento
│   ├── nginx/               # Configuraciones Nginx + SSL
│   └── postgres/            # Inicialización PostgreSQL
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   ├── components/          # Componentes reutilizables
│   ├── types/               # Definiciones TypeScript
│   └── utils/               # Utilidades y helpers
├── prisma/                  # Schema y migraciones
├── docker-compose.yml       # Orquestación de servicios
├── .env.example             # Variables de entorno
└── package.json
```

## Tecnologías

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: API Routes, NextAuth.js, Prisma ORM
- **Base de Datos**: PostgreSQL 15
- **Deploy**: Docker, Nginx, Let's Encrypt SSL
- **UI Components**: React Hook Form, Zod, Lucide React

## Deploy de Producción

### Prerequisitos
- Docker y Docker Compose instalados
- Dominio configurado (descubre.emma.pe)
- Puerto 80 y 443 abiertos en el servidor

### Deploy Automático

```bash
# 1. Configurar variables de entorno
cp .env.example .env
nano .env  # Editar credenciales

# 2. Ejecutar deploy
./deploy/deploy.sh          # Linux/macOS
deploy\deploy.bat          # Windows

# 3. Verificar
curl https://descubre.emma.pe
```

### Características del Deploy

- **SSL Automático**: Let's Encrypt con renovación automática
- **Dos Fases**: HTTP inicial → Obtener SSL → HTTPS final  
- **Nginx Optimizado**: HTTP/2, compresión, security headers
- **Base de Datos**: PostgreSQL con optimizaciones de rendimiento
- **Monitoreo**: Health checks y métricas integradas

## Desarrollo Local

### Configuración Inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
cp .env.example .env.local
# Editar DATABASE_URL en .env.local

# 3. Configurar Prisma
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Iniciar desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción  
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run seed         # Ejecutar seeders
npm run db:reset     # Resetear base de datos
```

## Base de Datos

### Modelos Principales

- **Users**: Gestión de usuarios y roles (admin, editor, guest, reader)
- **Blogs**: Sistema de gestión de contenido
- **Jobs & Recruitment**: Ofertas de trabajo y reclutamiento
- **Contacts & Subscriptions**: Gestión de contactos y suscripciones
- **Notifications**: Sistema de notificaciones
- **Files**: Gestión de archivos y uploads

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver estado de migraciones  
npx prisma migrate status

# Prisma Studio
npx prisma studio

# Reiniciar Migraciones
npx prisma migrate reset
```

## Autenticación

Sistema de autenticación robusto con NextAuth.js:

- **Roles**: Sistema de roles granular (admin, editor, guest, reader)
- **Sesiones**: Manejo seguro de sesiones con JWT
- **Protección**: Middleware de autenticación en rutas protegidas
- **API**: Endpoints de autenticación RESTful

## Uploads y Archivos

Sistema de gestión de archivos integrado:

```
public/uploads/
├── blog/            # Imágenes de blog posts
├── user/            # Avatares de usuarios
├── slide/           # Imágenes de sliders
└── recruitment/     # Archivos de reclutamiento
```

## Mantenimiento

### Comandos de Mantenimiento

```bash
# Estado del sistema
./deploy/maintenance.sh status

# Backup de base de datos  
./deploy/maintenance.sh backup

# Actualizar aplicación
./deploy/maintenance.sh update

# Verificar salud del sistema
./deploy/maintenance.sh health

# Renovar certificados SSL
./deploy/maintenance.sh ssl
```

### Monitoreo

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Métricas de recursos
docker stats

# Estado de servicios
docker-compose ps
```

## Seguridad

- **SSL/TLS**: Certificados automáticos Let's Encrypt
- **Headers**: Security headers (HSTS, CSP, etc.)
- **Rate Limiting**: Protección contra ataques DDoS
- **Autenticación**: Sistema robusto de roles y permisos
- **Validación**: Validación de datos con Zod
- **CORS**: Configuración segura de CORS

## Performance

- **SSR/SSG**: Renderizado optimizado con Next.js
- **Caching**: Cache inteligente de recursos estáticos
- **Compresión**: Gzip activado en Nginx
- **CDN Ready**: Preparado para CDN
- **Database**: PostgreSQL optimizada para producción

## Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

**¡EMMA HR Software - Gestión de recursos humanos moderna y eficiente!**
