# Dockerfile para EMMA Next.js App
FROM node:22.12-alpine AS base

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

# Copiar build artifacts (standalone incluye node_modules necesarios)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar archivos de Prisma para migraciones
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copiar package.json para scripts db:deploy
COPY --chown=nextjs:nodejs package.json ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecutar migraciones y luego la aplicación usando standalone
CMD ["sh", "-c", "npm run db:deploy && node .next/standalone/server.js"]