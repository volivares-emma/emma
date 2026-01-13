#!/bin/sh

# EMMA Docker Bootstrap Script
# Ejecuta las migraciones de Prisma antes de iniciar la aplicación
# Variables de entorno del docker-compose.yaml no se pasan a subprocesos
# Por eso necesitamos pasar DATABASE_URL explícitamente aquí

set -e

echo "Ejecutando migraciones de Prisma..."
DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy

echo "Migraciones completadas"
echo "Iniciando aplicación..."

# Iniciar la aplicación Node.js
DATABASE_URL="${DATABASE_URL}" node server.js
