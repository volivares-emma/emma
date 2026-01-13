-- Inicialización de la base de datos EMMA
-- Este archivo solo crea extensiones básicas
-- Las migraciones y esquema se manejan con Prisma

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";