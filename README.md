# EMMA - HR Software Platform

Sistema completo de gestión de recursos humanos construido con Next.js, TypeScript, Prisma y PostgreSQL.

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local (npm)
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos (requiere PostgreSQL local)
cp .env.example .env.local
# Editar DATABASE_URL en .env.local

# 3. Configurar Prisma
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Iniciar desarrollo
npm run dev
```

Acceder en: http://localhost:3000

### Opción 2: Desarrollo con Docker (Recomendado)
```bash
# 1. Configurar ambiente
cp .env.example .env.prod
nano .env.prod  # Editar si es necesario

# 2. Iniciar servicios (postgres + webapp)
docker-compose -f docker-compose.dev.yml up -d

# 3. Verificar logs
docker-compose -f docker-compose.dev.yml logs -f
```

Acceder en: http://localhost:3000

### Opción 3: Producción con Deploy
```bash
# 1. Configurar variables de entorno
cp .env.example .env.prod
nano .env.prod  # Editar credenciales OBLIGATORIAS

# 2. Ejecutar setup automático (Linux)
chmod +x deploy/linux/setup.sh
./deploy/linux/setup.sh

# 3. Verificar
curl https://descubre.emma.pe
```

Acceder en: https://descubre.emma.pe (con SSL)

---

## Tecnologías

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: API Routes, NextAuth.js, Prisma ORM
- **Base de Datos**: PostgreSQL 15
- **Deploy**: Docker, Nginx, Let's Encrypt SSL
- **UI Components**: React Hook Form, Zod, Lucide React

---

## 🐳 Docker Compose

### Desarrollo (Sin SSL, sin Nginx)
```bash
# Usar: docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up -d

# Servicios incluidos:
# - PostgreSQL (puerto 5432)
# - Next.js (puerto 3000)
# - Hot reload habilitado
```

### Producción (Con SSL, con Nginx)
```bash
# Usar: docker-compose.yml
docker-compose up -d

# Servicios incluidos:
# - PostgreSQL (puerto 5432)
# - Next.js (puerto 3000)
# - Nginx proxy (puertos 80/443)
# - Certbot SSL automático
```

---

## Características del Deploy de Producción

- **SSL Automático**: Let's Encrypt con renovación automática (cada 12h)
- **Dos Fases**: HTTP inicial → Obtener SSL → HTTPS final  
- **Nginx Optimizado**: HTTP/2, compresión, security headers
- **Base de Datos**: PostgreSQL con optimizaciones de rendimiento
- **Monitoreo**: Health checks y métricas integradas
- **Backup Automático**: Backups diarios de PostgreSQL

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (hot reload)

# Build
npm run build        # Build de producción  
npm run start        # Servidor de producción

# Linting
npm run lint         # Linting con ESLint

# Base de datos
npm run db:seed      # Ejecutar seeders
npm run db:push      # Sincronizar schema
npm run db:deploy    # Aplicar migraciones (producción)

# Docker
docker-compose -f docker-compose.dev.yml up -d       # Desarrollo
docker-compose up -d                                 # Producción
```

---

## 🗄️ Base de Datos

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver estado de migraciones  
npx prisma migrate status

# Prisma Studio (UI visual)
npx prisma studio

# Resetear migraciones (CUIDADO: elimina datos)
npx prisma migrate reset
```

### Seed de Datos

```bash
# Desarrollo (completo con usuarios de prueba)
npx prisma db seed

# Producción (solo admin)
NODE_ENV=production npx prisma db seed
```

---

## 🔐 Autenticación

Sistema de autenticación robusto con NextAuth.js:

- **Roles**: Sistema de roles granular (admin, editor, guest, reader)
- **Sesiones**: Manejo seguro de sesiones con JWT
- **Protección**: Middleware de autenticación en rutas protegidas
- **API**: Endpoints de autenticación RESTful
- **Credenciales por defecto** (Producción): 
  - Email: `victor.olivares@emma.pe`
  - Password: `Password123$`

---

## 📁 Uploads y Archivos

Sistema de gestión de archivos integrado:

```
public/uploads/
├── blog/            # Imágenes de blog posts
├── user/            # Avatares de usuarios
├── slide/           # Imágenes de sliders
└── recruitment/     # Archivos de reclutamiento
```

---

## 🛠️ Mantenimiento

### Comandos de Docker

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f              # Todos
docker-compose logs -f webapp       # Solo app
docker-compose logs -f postgres     # Solo BD

# Reiniciar servicios
docker-compose restart              # Todos
docker-compose restart webapp       # Solo app

# Detener servicios
docker-compose stop                 # Pausa
docker-compose down                 # Detiene
docker-compose down -v              # Detiene y elimina volúmenes

# Métricas de recursos
docker stats

# Limpiar recursos no usados
docker system prune -a
```

### Script de Mantenimiento (Producción)

```bash
# Desde directorio web/
./deploy/linux/maintenance.sh [comando]

# Comandos disponibles:
./deploy/linux/maintenance.sh status     # Estado general
./deploy/linux/maintenance.sh logs       # Ver logs
./deploy/linux/maintenance.sh backup     # Backup BD
./deploy/linux/maintenance.sh update     # Actualizar app
./deploy/linux/maintenance.sh health     # Verificar salud
```

---

## 📚 Documentación Completa

Ver [SETUP.md](./SETUP.md) para:
- Configuración detallada del servidor
- Setup manual paso a paso
- Configuración SSL (Let's Encrypt)
- Troubleshooting completo
- Backup y restauración
- Monitoreo avanzado (Prometheus + Grafana)

---

## 🚨 Troubleshooting Rápido

### Error: "database does not exist"
```bash
# Verificar archivo .env o .env.prod existe
cat .env.prod | grep DATABASE_URL

# Reiniciar desde cero
docker-compose down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Error: "Can't connect to PostgreSQL"
```bash
# Verificar que postgres esté corriendo
docker-compose ps postgres

# Ver logs
docker-compose logs postgres

# Reiniciar postgres
docker-compose restart postgres
```

### Error: "The datasource.url property is required"
```bash
# Asegurar que existe .env.prod con DATABASE_URL
ls -la .env.prod

# O para desarrollo
ls -la .env.local
```

---

## 📊 Estructura del Proyecto

```
web/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/             # Utilidades
│   ├── types/           # TypeScript types
│   └── utils/           # Helpers
├── prisma/
│   ├── schema.prisma    # Schema de BD
│   ├── seed.ts          # Data inicial
│   └── migrations/      # Historial de cambios
├── deploy/              # Scripts de deployment
├── public/              # Archivos estáticos
├── Dockerfile           # Imagen Docker
├── docker-compose.yml       # Producción
├── docker-compose.dev.yml   # Desarrollo
├── SETUP.md             # Guía de setup
└── README.md            # Este archivo
```

---

**¡EMMA HR Software - Gestión de recursos humanos moderna y eficiente!** 🚀


### Reinicio
```bash
docker-compose down -v
docker system prune -a -f

chmod +x deploy/linux/deploy.sh
./deploy/linux/deploy.sh
```