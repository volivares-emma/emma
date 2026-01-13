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
- `NEXTAUTH_SECRET`: genera uno con `openssl rand -base64 32` o `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `NEXTAUTH_URL`: `http://localhost:3000` (desarrollo)
- Variables de Firebase (si necesitas)

### 3. Ejecutar el setup completo (recomendado)

**Windows (PowerShell):**
```bash
.\deploy\windows\setup.bat
```

**Linux/Mac:**
```bash
bash deploy/setup.sh
```

Este script ejecutará automáticamente:
1. ✅ Detiene contenedores previos
2. ✅ Inicia **PostgreSQL** en puerto `5432`
3. ✅ Espera a que PostgreSQL esté listo
4. ✅ Construye y levanta **Next.js webapp** en puerto `3000`
5. ✅ **Crea la migración inicial** si no existe (te pedirá el nombre)
6. ✅ Ejecuta las **migraciones de Prisma** (crea las tablas)
7. ✅ Ejecuta el **seed** (carga datos iniciales)
8. ✅ La aplicación está lista para usar

**Es lo único que necesitas ejecutar.** El script maneja todo automáticamente, incluso la creación de migraciones si es la primera vez.

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
# Generar cliente de Prisma
docker-compose -f docker-compose.dev.yml exec -T webapp npx prisma generate

# Ejecutar migraciones manualmente
docker-compose -f docker-compose.dev.yml exec -T webapp npx prisma migrate deploy

# Ejecutar seed manualmente
docker-compose -f docker-compose.dev.yml exec -T webapp npm run db:seed
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
