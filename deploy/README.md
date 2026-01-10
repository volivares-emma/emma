# 🚀 Deploy - EMMA HR Software

**Directorio de deployment integrado al repositorio principal**

## 📁 Estructura Interna

```
web/
├── deploy/                   # ✅ Deploy interno al repositorio
│   ├── deploy.sh            # Script principal Linux/macOS
│   ├── maintenance.sh       # Herramientas de mantenimiento
│   ├── nginx/
│   │   ├── nginx.conf       # Configuración principal Nginx
│   │   ├── sites-available/
│   │   │   ├── emma-http.conf    # HTTP inicial (Fase 1)
│   │   │   └── emma-https.conf   # HTTPS final (Fase 2)
│   │   ├── sites-enabled/        # Symlinks configuraciones activas
│   │   └── ssl/                  # Certificados SSL
│   ├── postgres/
│   │   └── init.sql         # Inicialización PostgreSQL
│   └── README.md            # Este archivo
├── docker-compose.yml       # Orquestación servicios
├── .env.example            # Variables de entorno
└── ...                     # Resto del código Next.js
```

## ⚡ Deploy Rápido

### ⚠️ Deploy en Dos Fases

### 1. Configuración Inicial

```bash
# Desde web/ (ubicación correcta)
cp .env.example .env
nano .env  # Editar credenciales obligatorias
```

### 2. Deploy Automático

**Linux/macOS:**
```bash
# Desde web/
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

**Windows:**
```cmd
REM Desde web\
deploy\deploy.bat
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
```

## 🚨 Troubleshooting

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