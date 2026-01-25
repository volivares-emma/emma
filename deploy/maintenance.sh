#!/bin/bash

# EMMA Maintenance Script (Estructura Interna)
# Utilidades para el mantenimiento de la aplicación en producción
# Ubicación: emma/deploy/maintenance.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar que Docker Compose esté funcionando
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado"
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon no está corriendo"
    fi
    
    # Moverse al directorio emma
    cd "$(dirname "$0")/.."
    
    if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
        error "No se encuentra package.json o docker-compose.yml. Ejecuta desde emma/"
    fi
}

# Mostrar ayuda
show_help() {
    echo -e "${BLUE}EMMA Maintenance Script (Estructura Interna)${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  status       - Mostrar estado de todos los servicios"
    echo "  logs         - Ver logs en tiempo real"
    echo "  restart      - Reiniciar todos los servicios"
    echo "  update       - Actualizar la aplicación"
    echo "  backup       - Crear backup de la base de datos"
    echo "  restore      - Restaurar backup de la base de datos"
    echo "  health       - Verificar salud de la aplicación"
    echo "  ssl          - Renovar certificados SSL"
    echo "  clean        - Limpiar contenedores y volúmenes no utilizados"
    echo "  reset        - Recrear toda la aplicación (DESTRUCTIVO)"
    echo "  help         - Mostrar esta ayuda"
}

# Mostrar estado de servicios
show_status() {
    log "Estado de servicios Docker:"
    docker-compose ps
    
    echo ""
    log "Uso de recursos:"
    docker stats --no-stream
    
    echo ""
    log "Espacio en disco:"
    df -h /
    
    echo ""
    log "Conectividad de la aplicación:"
    if curl -s -f https://descubre.emma.pe > /dev/null; then
        echo -e "${GREEN}Aplicación accesible en HTTPS${NC}"
    else
        echo -e "${RED}Aplicación NO accesible${NC}"
    fi
}

# Ver logs
show_logs() {
    log "Mostrando logs en tiempo real (Ctrl+C para salir):"
    docker-compose logs -f --tail=100
}

# Reiniciar servicios
restart_services() {
    log "Reiniciando todos los servicios..."
    docker-compose restart
    
    log "Esperando a que los servicios estén listos..."
    sleep 10
    
    log "Verificando estado después del reinicio:"
    docker-compose ps
}

# Actualizar aplicación
update_app() {
    log "Iniciando actualización de la aplicación..."
    
    # Hacer backup antes de actualizar
    log "Creando backup automático antes de la actualización..."
    backup_database
    
    # Obtener últimos cambios (desde emma/)
    log "Obteniendo últimos cambios del repositorio..."
    git fetch origin
    git pull origin main
    
    # Reconstruir imagen de la aplicación
    log "Reconstruyendo imagen de la aplicación..."
    docker-compose build webapp
    
    # Aplicar migraciones de base de datos
    log "Aplicando migraciones de base de datos..."
    docker-compose run --rm webapp npx prisma migrate deploy
    
    # Reiniciar aplicación
    log "Reiniciando aplicación..."
    docker-compose up -d webapp
    
    # Verificar que funcione
    sleep 10
    if curl -s -f https://descubre.emma.pe > /dev/null; then
        log "Actualización completada exitosamente"
    else
        warn "La aplicación no responde, verificando logs..."
        docker-compose logs webapp --tail=20
    fi
}

# Backup de base de datos
backup_database() {
    BACKUP_DIR="./backups/postgres"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/emma_backup_$TIMESTAMP.sql"
    
    log "Creando backup de la base de datos..."
    
    if docker-compose exec -T postgres pg_dump -U emma_user emma_db > "$BACKUP_FILE"; then
        # Comprimir backup
        gzip "$BACKUP_FILE"
        
        log "Backup completado: $BACKUP_FILE.gz"
        
        # Limpiar backups antiguos (mantener últimos 7)
        cd "$BACKUP_DIR"
        ls -t *.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm
        cd - > /dev/null
        
        log "Backups antiguos limpiados"
    else
        error "Fallo al crear backup"
    fi
}

# Restaurar backup
restore_database() {
    BACKUP_DIR="./backups/postgres"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        error "Directorio de backups no encontrado: $BACKUP_DIR"
    fi
    
    echo ""
    log "Backups disponibles:"
    ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null || error "No hay backups disponibles"
    
    echo ""
    echo -n "Ingresa el nombre del archivo de backup (sin ruta): "
    read -r BACKUP_NAME
    
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        error "Backup no encontrado: $BACKUP_FILE"
    fi
    
    warn "ADVERTENCIA: Esto sobrescribirá la base de datos actual"
    echo -n "¿Estás seguro? (escribe 'SI' para continuar): "
    read -r CONFIRM
    
    if [ "$CONFIRM" != "SI" ]; then
        error "Operación cancelada"
    fi
    
    log "Restaurando backup: $BACKUP_FILE"
    
    # Detener aplicación
    docker-compose stop webapp
    
    # Restaurar base de datos
    gunzip -c "$BACKUP_FILE" | docker-compose exec -T postgres psql -U emma_user -d emma_db
    
    # Reiniciar aplicación
    docker-compose start webapp
    
    log "Restauración completada"
}

# Verificar salud de la aplicación
health_check() {
    log "Verificando salud de la aplicación..."
    
    # Verificar servicios Docker
    echo ""
    info "Estado de servicios:"
    docker-compose ps
    
    # Verificar conectividad HTTPS
    echo ""
    info "Verificando conectividad HTTPS:"
    if curl -s -f -I https://descubre.emma.pe | head -1; then
        echo -e "${GREEN}HTTPS OK${NC}"
    else
        echo -e "${RED}HTTPS FALLO${NC}"
    fi
    
    # Verificar redirección HTTP -> HTTPS
    echo ""
    info "Verificando redirección HTTP -> HTTPS:"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L http://descubre.emma.pe)
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}Redirección HTTP -> HTTPS OK${NC}"
    else
        echo -e "${RED}Redirección FALLO (Status: $HTTP_STATUS)${NC}"
    fi
    
    # Verificar certificado SSL
    echo ""
    info "Verificando certificado SSL:"
    if openssl s_client -connect descubre.emma.pe:443 -servername descubre.emma.pe </dev/null 2>/dev/null | grep -q "Verification: OK"; then
        echo -e "${GREEN}Certificado SSL válido${NC}"
    else
        echo -e "${RED}Certificado SSL inválido${NC}"
    fi
    
    # Verificar base de datos
    echo ""
    info "Verificando conexión a base de datos:"
    if docker-compose exec postgres pg_isready -U emma_user -d emma_db > /dev/null; then
        echo -e "${GREEN}Base de datos OK${NC}"
    else
        echo -e "${RED}Base de datos NO disponible${NC}"
    fi
    
    # Verificar espacio en disco
    echo ""
    info "Verificando espacio en disco:"
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 80 ]; then
        echo -e "${GREEN}Espacio en disco OK ($DISK_USAGE% usado)${NC}"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        echo -e "${YELLOW}Espacio en disco limitado ($DISK_USAGE% usado)${NC}"
    else
        echo -e "${RED}Espacio en disco crítico ($DISK_USAGE% usado)${NC}"
    fi
}

# Renovar certificados SSL
renew_ssl() {
    log "Renovando certificados SSL..."
    
    docker-compose run --rm certbot renew
    
    log "Reiniciando nginx para aplicar nuevos certificados..."
    docker-compose restart nginx
    
    log "Renovación de SSL completada"
}

# Limpiar Docker
clean_docker() {
    log "Limpiando contenedores y volúmenes no utilizados..."
    
    # Mostrar espacio antes
    echo ""
    info "Espacio antes de la limpieza:"
    docker system df
    
    # Limpiar
    docker system prune -f
    docker volume prune -f
    
    # Mostrar espacio después
    echo ""
    info "Espacio después de la limpieza:"
    docker system df
    
    log "Limpieza completada"
}

# Reset completo (DESTRUCTIVO)
reset_app() {
    warn "ADVERTENCIA: Esto eliminará TODA la aplicación y datos"
    warn "Solo los backups en ./backups/ se conservarán"
    echo ""
    echo -n "¿Estás ABSOLUTAMENTE seguro? (escribe 'ELIMINAR TODO' para continuar): "
    read -r CONFIRM
    
    if [ "$CONFIRM" != "ELIMINAR TODO" ]; then
        error "Operación cancelada"
    fi
    
    log "Creando backup de emergencia antes del reset..."
    backup_database
    
    log "Deteniendo y eliminando todos los contenedores..."
    docker-compose down -v
    
    log "Eliminando imágenes de la aplicación..."
    docker rmi emma_webapp 2>/dev/null || true
    
    log "Recreando aplicación desde cero..."
    docker-compose up -d
    
    log "Esperando a que los servicios estén listos..."
    sleep 30
    
    log "Aplicando migraciones..."
    docker-compose exec webapp npx prisma migrate deploy
    
    log "Ejecutando seeders..."
    docker-compose exec webapp npm run seed
    
    log "Reset completado - aplicación recreada desde cero"
}

# Main
case "${1:-help}" in
    "status")
        check_docker
        show_status
        ;;
    "logs")
        check_docker
        show_logs
        ;;
    "restart")
        check_docker
        restart_services
        ;;
    "update")
        check_docker
        update_app
        ;;
    "backup")
        check_docker
        backup_database
        ;;
    "restore")
        check_docker
        restore_database
        ;;
    "health")
        check_docker
        health_check
        ;;
    "ssl")
        check_docker
        renew_ssl
        ;;
    "clean")
        check_docker
        clean_docker
        ;;
    "reset")
        check_docker
        reset_app
        ;;
    "help"|*)
        show_help
        ;;
esac