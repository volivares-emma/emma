# Dockerfile para EMMA Next.js App
FROM node:22.12-alpine AS base

# Instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app


# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate


#Enables Hot Reloading Check https://github.com/vercel/next.js/issues/36774 for more information
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /root/.npm /root/.npm
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

# Build de la aplicación
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1


# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Uncomment this if you're using prisma, copies prisma files for linting
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["npm", "run", "start:migrate:prod"]