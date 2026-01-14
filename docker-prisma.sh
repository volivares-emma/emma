#!/bin/sh
set -e

echo "Ejecutando migraciones de Prisma..."

# Prisma v7 usa PRISMA_DATABASE_URL
if [ -z "$PRISMA_DATABASE_URL" ]; then
    echo "ERROR: PRISMA_DATABASE_URL no está definida"
    env | grep -i prisma || true
    exit 1
fi

echo "Prisma DB URL: ${PRISMA_DATABASE_URL:0:30}..."

npx prisma migrate deploy

echo "Migraciones completadas"
echo "Iniciando aplicación..."

node server.js
