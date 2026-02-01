# Setup (EMMA)

## Requisitos
- Node.js 20+
- PostgreSQL 16+
- Docker (opcional, para producción)

## Desarrollo local

### Backend
1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. Configurar variables de BD y JWT en `.env`:
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`
5. Ejecutar migraciones y seed:
   - `npm run migration:run`
   - `npm run seed`
6. `npm run start:dev`

API: http://localhost:3001/api/v1

### Frontend
1. `cd frontend`
2. `npm install`
3. `cp .env.example .env`
4. Configurar `NEXT_PUBLIC_API_URL` (opcional)
5. `npm run dev`

Web: http://localhost:3000

## Producción con Docker + Caddy
1. En la raíz del proyecto: `cp .env.docker .env`
2. Editar valores sensibles (`POSTGRES_PASSWORD`, `JWT_SECRET`, etc.)
3. `docker compose up -d --build`

Notas:
- Caddy expone los puertos 80/443 y gestiona SSL.
- El dominio se configura en `Caddyfile`.

## Migraciones y seed
- Ver [MIGRATIONS.md](./MIGRATIONS.md)
