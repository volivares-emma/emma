#!/bin/sh

# EMMA Docker Bootstrap Script
# Ejecuta las migraciones de Prisma antes de iniciar la aplicación

set -e

echo "Ejecutando migraciones de Prisma..."

# Verificar que DATABASE_URL está disponible
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL no está definida"
    echo "Variables disponibles:"
    env | grep -i database || echo "No se encontró DATABASE_URL"
    exit 1
fi

echo "Database URL: ${DATABASE_URL:0:30}..."

npx prisma migrate deploy

echo "Migraciones completadas"
echo "Iniciando aplicación..."

# Iniciar la aplicación Node.js
node server.js
