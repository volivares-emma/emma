#!/bin/bash

# EMMA Deploy Script (Estructura Interna)
# Deploy automático con estrategia de dos fases para SSL
# Ubicación: emma/deploy/setup.sh

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
INCLUDE_WWW=false
CERTBOT_WEBROOT="certbot_www"
ACME_PATH="$CERTBOT_WEBROOT/.well-known/acme-challenge"


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

# 3. Configurar directorio de trabajo
cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"
log "Directorio del proyecto: $PROJECT_ROOT"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    error "No se encuentra package.json o docker-compose.yml. Verifica que estés en el directorio emma/"
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

# 5. Crear estructura de directorios
log "Preparando estructura de directorios..."
mkdir -p deploy/nginx/ssl/live/$DOMAIN
mkdir -p deploy/nginx/conf.d
mkdir -p public/uploads/{blog,user,slide,recruitment}
mkdir -p backups/postgres

# Directorio ACME para Certbot (CRÍTICO)
mkdir -p "$ACME_PATH"

# Validación explícita (anti-sustos)
if [ ! -d "$ACME_PATH" ]; then
    error "No se pudo crear el directorio ACME: $ACME_PATH"
fi

log "Directorio ACME preparado: $ACME_PATH"

# 6. Validar Docker Compose
log "Validando configuración de Docker Compose..."
if ! docker-compose config > /dev/null 2>&1; then
    error "Error en docker-compose.yml. Verifica la sintaxis."
fi

# 7. Construir imágenes
log "Construyendo imagen de la aplicación..."
docker-compose build webapp

# 8. Iniciar servicios en FASE 1 (HTTP solamente)
log "Iniciando servicios base (nginx, app, db)..."
docker-compose up -d postgres webapp nginx certbot

# 9. Esperar a que los servicios estén listos
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

# 10. Esperar a que las migraciones se ejecuten en el contenedor
log "Las migraciones se ejecutarán automáticamente al iniciar la aplicación..."
sleep 20

# 11. Verificar aplicación en HTTP
log "Verificando aplicación en HTTP..."
if curl -f "http://$DOMAIN/health" > /dev/null 2>&1; then
    log "Aplicación respondiendo correctamente en HTTP"
elif curl -f "http://$DOMAIN" > /dev/null 2>&1; then
    log "Aplicación respondiendo en HTTP (sin endpoint /health)"
else
    warn "Aplicación no responde inmediatamente en HTTP"
    log "Continuando con obtención de SSL..."
fi

# Verificar acceso público al ACME challenge (CRÍTICO)
log "Verificando acceso al ACME challenge..."

TEST_FILE="$ACME_PATH/test.txt"
echo "ok" > "$TEST_FILE"

if curl -f "http://$DOMAIN/.well-known/acme-challenge/test.txt" > /dev/null 2>&1; then
    log "ACME challenge accesible desde Internet"
else
    error "ACME challenge NO es accesible.
Nginx no está sirviendo correctamente el webroot.
No se puede continuar con Certbot."
fi

rm -f "$TEST_FILE"


# 12. FASE 2: Obtener certificados SSL
log "FASE 2: Obteniendo certificados SSL..."

if [ -f "deploy/nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    log "Certificados SSL ya existen"
    SSL_ENABLED=true
else
    log "Obteniendo certificados SSL de Let's Encrypt..."
    
    # Preguntar si incluir www
    echo -n "¿Incluir subdominio www en el certificado? (s/N): "
    read -r INCLUDE_WWW_PROMPT
    if [ "$INCLUDE_WWW_PROMPT" = "s" ] || [ "$INCLUDE_WWW_PROMPT" = "S" ]; then
        INCLUDE_WWW=true
    fi
    
    # Esperar a que certbot esté listo
    sleep 5
    
    # Construir comando certonly con o sin www
    CERTBOT_CMD="docker-compose exec -T certbot certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email --non-interactive --cert-name $DOMAIN -d $DOMAIN"
    
    if [ "$INCLUDE_WWW" = true ]; then
        CERTBOT_CMD="$CERTBOT_CMD -d www.$DOMAIN"
    fi
    
    if eval $CERTBOT_CMD; then
        log "Certificados SSL obtenidos exitosamente"
        SSL_ENABLED=true
    else
        error "Fallo al obtener certificados SSL. Posibles causas:
- DNS no está configurado correctamente
- El dominio no apunta a este servidor  
- Let's Encrypt rate limit alcanzado
- Firewall bloqueando puerto 80
- Certbot no puede acceder al webroot"
    fi
fi

# 13. Verificación final
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

# 14. Resultado final
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