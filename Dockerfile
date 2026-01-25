# Dockerfile para EMMA Next.js App
FROM node:22.12-alpine AS base

# Instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild para producción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

# Copiar build artifacts (standalone incluye node_modules necesarios)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación

# Command to run the application, waiting for the database to be ready and applying migrations
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npx prisma db seed && node server.js"]