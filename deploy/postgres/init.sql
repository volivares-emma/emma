-- Inicialización de la base de datos EMMA
-- Región: Latinoamérica / Lima (Perú)
-- Las migraciones y esquema se manejan con Prisma

-- Crear la base de datos si no existe
CREATE DATABASE emma_db
  WITH
  OWNER = emma_user
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_PE.utf8'
  LC_CTYPE = 'es_PE.utf8'
  TEMPLATE = template0;

-- Conectarse a la base
\c emma_db

-- Zona horaria por defecto (MUY IMPORTANTE)
ALTER DATABASE emma_db
  SET timezone TO 'America/Lima';

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
