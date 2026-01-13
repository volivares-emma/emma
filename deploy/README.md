# 🚀 Deploy - EMMA HR Software

**Directorio de deployment integrado al repositorio principal**

## ⚡ Deploy Rápido

### ⚠️ Deploy en Dos Fases

### 1. Configuración Inicial

```bash
# Desde web/ (ubicación correcta)
cp .env.example .env
nano .env  # Editar credenciales obligatorias
```

### 2. Deploy Automático

**Producción (Linux):**
```bash
# Desde web/
chmod +x deploy/linux/deploy.sh
./deploy/linux/deploy.sh
```

**Desarrollo (Windows):**
```cmd
REM Desde web\
deploy\windows\setup.bat
```

### 3. Verificación
```bash
# Ver servicios corriendo
docker-compose ps

# Verificar aplicación funcionando  
curl https://descubre.emma.pe
```

## 🔧 Servicios

- **webapp**: Next.js en puerto 3000
- **postgres**: PostgreSQL 15 con optimizaciones
- **nginx**: Proxy reverso con SSL automático
- **certbot**: Certificados Let's Encrypt

## 🛠 Mantenimiento

```bash
# Estado general
./deploy/maintenance.sh status

# Ver logs
./deploy/maintenance.sh logs

# Backup de DB
./deploy/maintenance.sh backup

# Actualizar app
./deploy/maintenance.sh update

# Verificar salud
./deploy/maintenance.sh health
```

## 🔒 SSL - Dos Fases

### Fase 1: HTTP
- Nginx con `emma-http.conf`
- Puerto 80 + ACME challenge
- Aplicación temporal en HTTP

### Fase 2: HTTPS  
- Certbot obtiene certificados
- Nginx cambia a `emma-https.conf`
- Puerto 443 + redirección automática

## 📋 Variables de Entorno (.env)

```env
# Base de datos
POSTGRES_USER=emma_user
POSTGRES_PASSWORD=password_super_seguro
POSTGRES_DB=emma_db
DATABASE_URL=postgresql://emma_user:password@postgres:5432/emma_db

# NextAuth
NEXTAUTH_SECRET=secret_minimo_32_caracteres  
NEXTAUTH_URL=https://descubre.emma.pe

# Seed automático
NODE_ENV=production  # Producción: solo admin. Desarrollo: todos los datos
```

## 🌱 Seed de Base de Datos

**Producción (`NODE_ENV=production`):**
- Usuario admin: `victor.olivares@emma.pe` / `Password123$`
- Sin blogs ni slides

**Desarrollo:**
- 7 usuarios de prueba (admin, editor, reader, guest, etc.)
- 3 blogs de demostración
- 5 slides para página principal

Ejecutar con:
```bash
NODE_ENV=production npx prisma db seed  # Producción
npx prisma db seed                      # Desarrollo
```

## 🚨 Troubleshooting

**Error: "The datasource.url property is required"**

Asegúrate de que:
1. El archivo `.env` existe y contiene `DATABASE_URL`
2. El `docker-compose.yml` está leyendo las variables correctamente
3. PostgreSQL está corriendo antes de que la aplicación intente conectarse

```bash
# Verificar que postgres está listo
docker-compose ps

# Ver logs de postgres
docker-compose logs postgres

# Reiniciar todo desde cero
docker-compose down -v
docker-compose up -d
```

**Error "database does not exist":**

```bash
# Verificar variables de entorno
docker-compose exec webapp env | grep DATABASE

# Ver contenido del .env
cat .env
```

Asegúrate de que en `.env`:
```env
POSTGRES_USER=emma_user
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=emma_db
DATABASE_URL=postgresql://emma_user:tu_password_seguro@postgres:5432/emma_db
```

**Error SSL:**
```bash
# Verificar certificados
ls -la deploy/nginx/ssl/live/descubre.emma.pe/

# Regenerar SSL
docker-compose run --rm certbot renew
docker-compose restart nginx
```

**Error aplicación:**
```bash
# Ver logs específicos
docker-compose logs webapp
docker-compose logs postgres
docker-compose logs nginx
```

## ✅ Ventajas Estructura Interna

1. **✅ Coherencia**: Todo en un repositorio
2. **✅ Simplicidad**: Rutas relativas desde web/
3. **✅ Mantenimiento**: Fácil versionado junto al código
4. **✅ CI/CD**: Deployment scripts junto al código fuente
5. **✅ Backup**: Deploy configs versionados con git

## 🎯 Comandos Desde web/

```bash
# Deploy completo
./deploy/deploy.sh

# Mantenimiento
./deploy/maintenance.sh [comando]

# Docker Compose (ubicación correcta)
docker-compose up -d
docker-compose logs -f
docker-compose restart
docker-compose down
```

**¡Deploy listo con estructura interna optimizada!** 🎉