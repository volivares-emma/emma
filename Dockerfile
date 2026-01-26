FROM node:20-bookworm-slim AS base
WORKDIR /app

# =====================
# Dependencias
# =====================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# =====================
# Builder
# =====================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# =====================
# Runner (Producción)
# =====================
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Usuario no-root
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs nextjs

# Copiar app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# CRÍTICO PARA PRISMA
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "start:migrate:prod"]
