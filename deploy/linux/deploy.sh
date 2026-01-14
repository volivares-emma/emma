#!/bin/bash

# EMMA Deploy Script (Estructura Interna)
# Deploy automático con estrategia de dos fases para SSL
# Ubicación: web/deploy/deploy.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
SSL_ENABLED=false
DOMAIN="descubre.emma.pe"
EMAIL="victor.olivares@emma.pe"

# Funciones auxiliares
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║         EMMA Deploy Script            ║"
echo "║    Deploy seguro con SSL automático   ║"
echo "║         (Estructura Interna)          ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# 1. Verificar prerequisitos
log "Verificando prerequisitos del sistema..."

if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Instálalo desde: https://docs.docker.com/get-docker/"
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado"
fi

if ! docker info &> /dev/null; then
    error "Docker daemon no está corriendo. Ejecuta: sudo systemctl start docker"
fi

log "Docker está configurado correctamente"

# 2. Verificar DNS
log "Verificando configuración DNS..."
if nslookup $DOMAIN > /dev/null 2>&1; then
    log "DNS configurado correctamente para $DOMAIN"
else
    warn "DNS no resuelve para $DOMAIN"
    warn "Asegúrate de que el dominio apunte al IP de este servidor"
    echo -n "¿Continuar de todos modos? (y/N): "
    read -r CONTINUE_DNS
    if [ "$CONTINUE_DNS" != "y" ] && [ "$CONTINUE_DNS" != "Y" ]; then
        error "Deploy cancelado. Configura el DNS primero."
    fi
fi

# 3. Configurar directorio de trabajo (estamos en deploy/linux/)
cd "$(dirname "$0")/../../"
PROJECT_ROOT="$(pwd)"
log "Directorio del proyecto: $PROJECT_ROOT"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    error "No se encuentra package.json o docker-compose.yml. Verifica que estés en el directorio web/"
fi

# 4. Verificar archivo .env
log "Verificando configuración de ambiente..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        log "Creando archivo .env desde .env.example..."
        cp .env.example .env
        warn "IMPORTANTE: Edita .env con tus credenciales de producción"
        warn "Variables críticas:"
        warn "- POSTGRES_PASSWORD (debe ser segura)"
        warn "- NEXTAUTH_SECRET (mínimo 32 caracteres)"
        warn "- Otros valores según necesites"
        echo ""
        echo -n "¿Has editado .env con credenciales de producción? (y/N): "
        read -r ENV_READY
        if [ "$ENV_READY" != "y" ] && [ "$ENV_READY" != "Y" ]; then
            error "Deploy cancelado. Configura .env primero."
        fi
    else
        error "No se encuentra .env.example. Verifica que estés en el directorio correcto."
    fi
fi

# Cargar variables de ambiente desde .env
log "Cargando configuración desde .env..."
set -a
source .env
set +a

# Construir DATABASE_URL con escape adecuado
DB_USER="${POSTGRES_USER:-emma_user}"
DB_PASS="${POSTGRES_PASSWORD}"
DB_NAME="${POSTGRES_DB:-emma_db}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@postgres:5432/${DB_NAME}"

# 5. Crear estructura de directorios
log "Preparando estructura de directorios..."
mkdir -p deploy/nginx/ssl/live/$DOMAIN
mkdir -p deploy/nginx/sites-enabled
mkdir -p public/uploads/{blog,user,slide,recruitment}
mkdir -p backups/postgres

# 6. Configurar nginx para HTTP inicial (Fase 1)
log "Configurando nginx para HTTP inicial..."

if [ ! -f "deploy/nginx/sites-available/emma-http.conf" ]; then
    error "No se encuentra el archivo de configuración HTTP de nginx"
fi

# Crear symlink para configuración HTTP
ln -sf /etc/nginx/sites-available/emma-http.conf deploy/nginx/sites-enabled/emma.conf

# 7. Validar Docker Compose
log "Validando configuración de Docker Compose..."
if ! docker-compose config > /dev/null 2>&1; then
    error "Error en docker-compose.yml. Verifica la sintaxis."
fi

# 8. Construir imágenes
log "Construyendo imagen de la aplicación..."
docker-compose build webapp

# 9. Iniciar servicios en FASE 1 (HTTP solamente)
log "FASE 1: Iniciando servicios en modo HTTP..."
docker-compose up -d postgres webapp nginx

# 10. Esperar a que los servicios estén listos
log "Esperando a que los servicios estén operativos..."
sleep 30

# Verificar que postgres esté listo
log "Verificando PostgreSQL..."
for i in {1..10}; do
    if docker-compose exec -T postgres pg_isready -U emma_user > /dev/null 2>&1; then
        log "PostgreSQL está listo"
        break
    fi
    if [ $i -eq 10 ]; then
        error "PostgreSQL no responde después de esperar"
    fi
    sleep 5
done

# 11. Esperar a que las migraciones se ejecuten en el contenedor
log "Las migraciones se ejecutarán automáticamente al iniciar la aplicación..."
sleep 20

# 12. Verificar aplicación en HTTP
log "Verificando aplicación en HTTP..."
if curl -f "http://$DOMAIN/health" > /dev/null 2>&1; then
    log "Aplicación respondiendo correctamente en HTTP"
elif curl -f "http://$DOMAIN" > /dev/null 2>&1; then
    log "Aplicación respondiendo en HTTP (sin endpoint /health)"
else
    warn "Aplicación no responde inmediatamente en HTTP"
    log "Continuando con obtención de SSL..."
fi

# 13. FASE 2: Obtener certificados SSL
log "FASE 2: Obteniendo certificados SSL..."

if [ -f "deploy/nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    log "Certificados SSL ya existen"
    SSL_ENABLED=true
else
    log "Obteniendo certificados SSL de Let's Encrypt..."
    
    if docker-compose exec -T certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d $DOMAIN \
        -d www.$DOMAIN; then
        
        log "Certificados SSL obtenidos exitosamente"
        SSL_ENABLED=true
    else
        error "Fallo al obtener certificados SSL. Posibles causas:
- DNS no está configurado correctamente
- El dominio no apunta a este servidor  
- Let's Encrypt rate limit alcanzado
- Firewall bloqueando puerto 80"
    fi
fi

# 14. Cambiar a configuración HTTPS
if [ "$SSL_ENABLED" = true ]; then
    log "Cambiando a configuración HTTPS..."
    
    if [ ! -f "deploy/nginx/sites-available/emma-https.conf" ]; then
        error "No se encuentra el archivo de configuración HTTPS de nginx"
    fi
    
    # Cambiar symlink a configuración HTTPS
    ln -sf /etc/nginx/sites-available/emma-https.conf deploy/nginx/sites-enabled/emma.conf
    
    # Reiniciar nginx con nueva configuración
    log "Reiniciando nginx con SSL..."
    docker-compose restart nginx
    
    # Iniciar renovación automática de certificados
    log "Iniciando servicio de renovación automática..."
    docker-compose up -d certbot
    
    # Esperar un momento para que nginx reinicie
    sleep 10
fi

# 15. Verificación final
log "Verificando deploy final..."

# Verificar servicios
if ! docker-compose ps | grep -q "Up"; then
    error "Algunos servicios no están corriendo correctamente"
fi

log "Estado de servicios:"
docker-compose ps

# Verificar conectividad
if [ "$SSL_ENABLED" = true ]; then
    log "Verificando HTTPS..."
    if curl -f "https://$DOMAIN/health" > /dev/null 2>&1; then
        log "HTTPS funcionando correctamente"
    elif curl -f "https://$DOMAIN" > /dev/null 2>&1; then
        log "HTTPS funcionando (sin endpoint /health)"
    else
        warn "HTTPS configurado pero no responde inmediatamente"
        warn "Puede tardar unos minutos en propagarse"
    fi
    
    # Verificar redirección HTTP -> HTTPS
    log "Verificando redirección HTTP -> HTTPS..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "http://$DOMAIN" || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        log "Redirección HTTP -> HTTPS funcionando"
    else
        warn "Redirección no funcionando correctamente (Status: $HTTP_STATUS)"
    fi
fi

# 16. Resultado final
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║             DEPLOY EXITOSO            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""

if [ "$SSL_ENABLED" = true ]; then
    log "Aplicación disponible en: https://$DOMAIN"
    log "SSL configurado y renovación automática activa"
else
    log "Aplicación disponible en: http://$DOMAIN"
    warn "SSL no configurado - aplicación corriendo solo en HTTP"
fi

echo ""
log "Comandos útiles:"
log "Ver logs:          docker-compose logs -f"
log "Reiniciar:         docker-compose restart"
log "Detener:           docker-compose down"
log "Mantenimiento:     ./deploy/linux/maintenance.sh"
log "Estado:            docker-compose ps"

echo ""
log "Archivos importantes:"
log "Logs nginx:        docker-compose logs nginx"
log "Logs aplicación:   docker-compose logs webapp"
log "Logs PostgreSQL:   docker-compose logs postgres"

echo ""
if [ "$SSL_ENABLED" = true ]; then
    log "Deploy completado exitosamente con SSL"
else
    warn "Deploy completado en HTTP - configura DNS para SSL"
fi