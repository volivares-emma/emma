# Docker Desarrollo para EMMA

## Requisitos
- Docker y Docker Compose instalados
- Un archivo `.env` en la raíz del proyecto con las variables de entorno

## Pasos para empezar

### 1. Copiar el `.env.example`
```bash
cp .env.example .env
```

### 2. Completar las variables de entorno
Edita `.env` y rellena con tus valores reales:
- `POSTGRES_PASSWORD`: contraseña segura para PostgreSQL
- `NEXTAUTH_SECRET`: genera uno con `openssl rand -base64 32` o node -e `console.log(require('crypto').randomBytes(32).toString('base64'))`
- `NEXTAUTH_URL`: `http://localhost:3000` (desarrollo)
- Variables de Firebase (si necesitas)

### 3. Iniciar los contenedores
```bash
docker-compose -f docker-compose.dev.yml up --build
```

Esto iniciará:
- **PostgreSQL** en puerto `5432`
- **Next.js webapp** en puerto `3000` (con hot reload)

### 4. Verificar que todo funciona
- Accede a `http://localhost:3000`
- La base de datos se ejecutará con los datos de `deploy/postgres/init.sql`

## Comandos útiles

### Ver logs
```bash
docker-compose -f docker-compose.dev.yml logs -f webapp
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Detener los contenedores
```bash
docker-compose -f docker-compose.dev.yml down
```

### Detener y eliminar datos de la BD
```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Ejecutar comandos en el contenedor
```bash
docker-compose -f docker-compose.dev.yml exec webapp npm run prisma:migrate
docker-compose -f docker-compose.dev.yml exec webapp npm run prisma:generate
```

### Acceder a la base de datos
```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U emma_user -d emma_db
```

## Estructura de desarrollo

- **Hot reload**: Los cambios en el código se reflejarán automáticamente (volúmenes mapeados)
- **Node modules**: Se instala dentro del contenedor, no se sincroniza con tu máquina local (más rápido)
- **Prisma**: Se genera automáticamente al iniciar

## Notas sobre el archivo `.env`

El `docker-compose.dev.yml` carga automáticamente las variables desde tu `.env`:
- PostgreSQL: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Next.js: todas las variables que necesites (incluidas las de Firebase)

**Importante**: no commits `.env` a Git. Solo versionea `.env.example`.
