#!/bin/sh
set -e

echo "Esperando que PostgreSQL esté disponible..."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL no está definida"
    exit 1
fi

# Extraer host de la DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's/postgresql:\/\/[^:]+:[^@]+@([^:]+).*/\1/')
DB_PORT=${DB_PORT:-5432}
DB_USER=${POSTGRES_USER:-emma_user}
DB_NAME=${POSTGRES_DB:-emma_db}

# Esperar a que PostgreSQL esté listo (máximo 30 segundos)
timeout 30 sh -c "until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME 2>/dev/null; do sleep 2; done" || {
    echo "ERROR: PostgreSQL no está disponible después de 30 segundos"
    exit 1
}

echo "ostgreSQL está listo"
echo "Aplicando migraciones de base de datos..."

# Aplicar migraciones (deploy mode - solo aplica, no crea nuevas)
npx prisma migrate deploy

echo "Generando cliente Prisma..."
npx prisma generate

echo "Base de datos configurada correctamente"
echo "Iniciando aplicación EMMA..."

node server.js
