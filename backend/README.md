# EMMA Backend

API de EMMA construida con NestJS, TypeORM y PostgreSQL.

## Requisitos
- Node.js 20+
- PostgreSQL 16+

## Configuración rápida
1. Instalar dependencias: `npm install`
2. Crear archivo de entorno: `cp .env.example .env`
3. Configurar variables de BD y JWT en `.env`:
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`
4. Migraciones y seed:
   - `npm run migration:run`
   - `npm run seed`
5. Ejecutar en desarrollo: `npm run start:dev`

## Scripts útiles
- `npm run start:dev`
- `npm run build`
- `npm run start:prod`
- `npm run migration:generate src/database/migrations/Nombre`
- `npm run migration:run`
- `npm run seed`

## Documentación
- Setup general: [docs/setup.md](../docs/setup.md)
- Migraciones y seed: [docs/MIGRATIONS.md](../docs/MIGRATIONS.md)
