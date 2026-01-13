# Dockerfile para EMMA Next.js App
FROM node:22.12-alpine AS base

# Dependencias base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package-lock.json package.json ./
RUN npm ci --prod

# Stage para desarrollo
FROM base AS development
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package-lock.json package.json ./
RUN npm ci

# Copiar archivo .env si existe
COPY .env* ./

# Copiar prisma schema
COPY prisma ./prisma

# Variables de entorno
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]

# Rebuild para producción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno de build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public

# Configurar permisos para archivos estáticos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar archivos de Prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]