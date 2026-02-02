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
3. (Solo primera vez) setear `RUN_DB_INIT=true` para crear tablas y seed
3. `docker compose up -d --build`

### Actualizar código en servidor (después de push)
1. `git pull`
2. `docker compose up -d --build`
3. (Opcional) Verificar estado: `docker compose ps`

Notas:
- `RUN_DB_INIT=true` ejecuta `schema:sync` + `seed` al arrancar el backend.
- Después de la primera inicialización, vuelve a `RUN_DB_INIT=false`.

### Detener y limpiar Docker
1. Detener servicios: `docker compose down`
2. Limpiar imágenes, contenedores y volúmenes: `docker system prune -a --volumes -f`

### Limpieza de Docker (rápida y segura)
Comando más efectivo para dejar Docker ligero:
- `docker system prune -a --volumes`

Qué elimina:
- Contenedores detenidos
- Imágenes no usadas
- Networks no usados
- Volúmenes no usados
- Caché de build

Advertencia:
- Borra TODO lo que no esté en uso. Si tienes datos en volúmenes que no están montados en contenedores activos, se perderán.

Modo controlado (recomendado):
1. Ver uso de espacio: `docker system df`
2. Limpiar builds: `docker builder prune -a`
3. Limpiar imágenes: `docker image prune -a`
4. Limpiar volúmenes huérfanos: `docker volume prune`

Flujo sugerido:
1. `docker system df`
2. `docker builder prune -a`
3. `docker image prune -a`
4. `docker volume prune`

Notas:
- Caddy expone los puertos 80/443 y gestiona SSL.
- El dominio se configura en `Caddyfile`.

## Migraciones y seed
- Ver [migrations.md](./migrations.md)
