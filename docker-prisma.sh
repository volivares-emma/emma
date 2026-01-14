#!/bin/sh
set -e

echo "Ejecutando migraciones de Prisma..."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL no está definida"
    env | grep -i database || true
    exit 1
fi

echo "Prisma DB URL: ${DATABASE_URL:0:30}..."

# Generar cliente Prisma con DATABASE_URL disponible
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

echo "Migraciones completadas"
echo "Iniciando aplicación..."

node server.js
