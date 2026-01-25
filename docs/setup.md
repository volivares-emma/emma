# 🚀 SETUP & DEPLOYMENT - EMMA HR Software

Guía completa para configurar y desplegar EMMA en desarrollo y producción con Docker, PostgreSQL, Nginx y certificados SSL automáticos.

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Prerequisitos](#prerequisitos)
3. [Configuración del Servidor](#configuración-del-servidor)
4. [Configuración DNS](#configuración-dns)
5. [Variables de Entorno](#variables-de-entorno)
6. [Setup Automático](#setup-automático)
7. [Configuración SSL](#configuración-ssl)
8. [Base de Datos](#base-de-datos)
9. [Mantenimiento](#mantenimiento)
10. [Troubleshooting](#troubleshooting)
11. [Backup y Restauración](#backup-y-restauración)
12. [Monitoreo](#monitoreo)

---

## ⚡ Inicio Rápido

### Desarrollo (Local)
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/emma.git
cd emma/web

# Configurar ambiente
cp .env.example .env
nano .env  # Editar si es necesario

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Producción (Linux)
```bash
# Desde directorio emma/
chmod +x deploy/setup.sh
./deploy/setup.sh
```

---

## 📦 Prerequisitos

### Para Desarrollo (Local)
- Docker Desktop
- Docker Compose v2+
- Git

### Para Producción (Servidor)
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Mínimo 2GB (Recomendado: 4GB+)
- **Storage**: Mínimo 20GB SSD
- **CPU**: 2 cores mínimo
- Docker
- Docker Compose v2+
- Git

---

## 🔧 Configuración del Servidor

### 1. Actualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Docker
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 3. Configurar Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# O iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

### 4. Optimización de Sistema
```bash
# Aumentar límites de archivos
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimización de red
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 🌐 Configuración DNS

### Antes del Deploy
Configura estos registros DNS en tu proveedor:

```dns
# Tipo A - Apuntar al IP de tu servidor
descubre.emma.pe.     300   IN   A   TU.IP.SERVIDOR.AQUI
www.descubre.emma.pe. 300   IN   A   TU.IP.SERVIDOR.AQUI

# Opcional: AAAA para IPv6
descubre.emma.pe.     300   IN   AAAA   tu:ipv6:aqui
www.descubre.emma.pe. 300   IN   AAAA   tu:ipv6:aqui
```

### Verificar DNS
```bash
nslookup descubre.emma.pe
nslookup www.descubre.emma.pe
```

---

## 📋 Variables de Entorno

### Crear archivo .env
```bash
cp .env.example .env
nano .env
```

### Variables Obligatorias
```env
# Ambiente
NODE_ENV=production

# Base de datos - ¡CAMBIA ESTAS CREDENCIALES!
POSTGRES_USER=emma_user
POSTGRES_PASSWORD=tu_password_super_seguro_aqui
POSTGRES_DB=emma_db

# NextAuth - ¡GENERA UN SECRET ÚNICO!
NEXTAUTH_SECRET=tu_nextauth_secret_de_32_caracteres_minimo
NEXTAUTH_URL=https://descubre.emma.pe

# URL de base de datos
DATABASE_URL=postgresql://emma_user:tu_password_super_seguro_aqui@postgres:5432/emma_db
```

### Generar Secrets Seguros
```bash
# Para NEXTAUTH_SECRET (mínimo 32 caracteres)
openssl rand -base64 32

# Para POSTGRES_PASSWORD
openssl rand -base64 16
```

---

## 🚀 Setup Automático

### Opción 1: Linux/macOS (Recomendado)

El script `setup.sh` automatiza todo el proceso:

```bash
# Desde web/
chmod +x deploy/setup.sh
./deploy/setup.sh
```

**El script realiza:**
1. ✅ Verifica requisitos (Docker, Docker Compose)
2. ✅ Valida configuración DNS
3. ✅ Crea directorios necesarios
4. ✅ Inicia PostgreSQL
5. ✅ Ejecuta migraciones de Prisma
6. ✅ Inicia aplicación Next.js
7. ✅ Configura Nginx (HTTP)
8. ✅ Obtiene certificados SSL con Let's Encrypt
9. ✅ Configura Nginx (HTTPS)
10. ✅ Inicia monitoreo y renovación automática

### Opción 2: Manual (Paso a Paso)

#### Paso 1: Configurar Directorios
```bash
mkdir -p deploy/nginx/ssl/live/descubre.emma.pe
mkdir -p deploy/nginx/sites-enabled
mkdir -p public/uploads/{blog,user,slide,recruitment}
mkdir -p backups/postgres
```

#### Paso 2: Iniciar Servicios
```bash
# Iniciar PostgreSQL, aplicación y Nginx (HTTP)
docker-compose up -d postgres webapp nginx certbot
```

#### Paso 3: Esperar Servicios
```bash
# Esperar ~30 segundos para que todo esté listo
sleep 30

# Verificar
docker-compose ps
```

#### Paso 4: Obtener Certificados SSL
```bash
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email tu-email@emma.pe \
    --agree-tos \
    --no-eff-email \
    -d descubre.emma.pe \
    -d www.descubre.emma.pe
```

#### Paso 5: Cambiar a HTTPS
```bash
# Actualizar configuración de Nginx
ln -sf /etc/nginx/sites-available/emma-https.conf deploy/nginx/sites-enabled/emma.conf

# Reiniciar Nginx
docker-compose restart nginx
```

#### Paso 6: Verificar
```bash
# Verificar servicios
docker-compose ps

# Probar HTTPS
curl -I https://descubre.emma.pe
```

---

## 🔒 Configuración SSL

### Proceso en Dos Fases

#### Fase 1: HTTP
- Nginx con `emma-http.conf`
- Puerto 80 abierto
- ACME challenge para certificados
- Aplicación temporal en HTTP

#### Fase 2: HTTPS
- Certbot obtiene certificados
- Nginx cambia a `emma-https.conf`
- Puerto 443 abierto
- Redirección automática HTTP → HTTPS

### Certificados Existentes
Si ya tienes certificados SSL:

```bash
mkdir -p ./deploy/nginx/ssl/live/descubre.emma.pe/
cp tu-certificado.pem ./deploy/nginx/ssl/live/descubre.emma.pe/fullchain.pem
cp tu-clave-privada.key ./deploy/nginx/ssl/live/descubre.emma.pe/privkey.pem

# Reiniciar Nginx
docker-compose restart nginx
```

### Renovación Automática
Los certificados se renuevan automáticamente cada 12 horas. Para verificar:

```bash
# Ver logs de certbot
docker-compose logs certbot

# Renovar manualmente (testing)
docker-compose run --rm certbot renew --dry-run

# Renovar forzado
docker-compose run --rm certbot renew --force-renewal
```

---

## 🗄️ Base de Datos

### Migraciones Automáticas
Las migraciones se ejecutan automáticamente al iniciar el contenedor:

```bash
# Ejecutado por: npm run db:deploy en el Dockerfile
npx prisma migrate deploy
npx prisma generate
```

### Seed de Datos

#### Producción (NODE_ENV=production)
```bash
NODE_ENV=production npx prisma db seed
```
**Crea:**
- Usuario admin: `victor.olivares@emma.pe` / `Password123$`
- Sin blogs ni slides

#### Desarrollo
```bash
npx prisma db seed
```
**Crea:**
- 7 usuarios de prueba (admin, editor, reader, guest, etc.)
- 3 blogs de demostración
- 5 slides para página principal

### Acceder a la Base de Datos
```bash
# Acceder con psql
docker-compose exec postgres psql -U emma_user -d emma_db

# Ejecutar queries
docker-compose exec postgres psql -U emma_user -d emma_db -c "SELECT * FROM tbl_users;"
```

---

## 🔄 Mantenimiento

### Servicios Disponibles
- **webapp**: Next.js en puerto 3000
- **postgres**: PostgreSQL 15 en puerto 5432
- **nginx**: Proxy reverso HTTPS en puertos 80/443
- **certbot**: Certificados Let's Encrypt con renovación automática

### Comandos Útiles

```bash
# Estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f              # Todos
docker-compose logs -f webapp       # Solo app
docker-compose logs -f postgres     # Solo BD
docker-compose logs -f nginx        # Solo proxy

# Reiniciar servicios
docker-compose restart              # Todos
docker-compose restart webapp       # Solo app
docker-compose restart nginx        # Solo proxy

# Actualizar aplicación
git pull
docker-compose build webapp
docker-compose up -d webapp

# Detener servicios
docker-compose stop                 # Pausa
docker-compose down                 # Detiene y limpia
docker-compose down -v              # Detiene, limpia y elimina volúmenes

# Limpiar recursos
docker system prune -a              # Elimina imágenes y contenedores no usados

# Ver métricas
docker stats                        # Recursos en tiempo real
```

### Script de Mantenimiento
```bash
# Desde web/
./deploy/linux/maintenance.sh [comando]

# Comandos disponibles
./deploy/linux/maintenance.sh status      # Estado general
./deploy/linux/maintenance.sh logs        # Ver logs
./deploy/linux/maintenance.sh backup      # Backup de BD
./deploy/linux/maintenance.sh update      # Actualizar aplicación
./deploy/linux/maintenance.sh health      # Verificar salud
```

### Monitoreo de Salud

```bash
# Script de health check
cat > health-check.sh << 'EOF'
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://descubre.emma.pe)
if [ $STATUS -eq 200 ]; then
    echo "Site is UP ($STATUS)"
else
    echo "Site is DOWN ($STATUS)"
    docker-compose restart webapp nginx
fi
EOF

chmod +x health-check.sh

# Agregar a crontab (verificar cada 5 minutos)
(crontab -l 2>/dev/null; echo "*/5 * * * * /path/to/health-check.sh") | crontab -
```

---

## 💾 Backup y Restauración

### Backup Automático de PostgreSQL

```bash
cat > backup-postgres.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/emma_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Crear backup
docker-compose exec -T postgres pg_dump -U emma_user emma_db > $BACKUP_FILE

# Comprimir
gzip $BACKUP_FILE

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "✅ Backup completado: $BACKUP_FILE.gz"
EOF

chmod +x backup-postgres.sh

# Agregar a crontab (backup diario a las 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup-postgres.sh") | crontab -
```

### Restaurar desde Backup

```bash
# Listar backups disponibles
ls -la ./backups/postgres/

# Restaurar backup específico
BACKUP_FILE="./backups/postgres/emma_backup_20250114_020000.sql.gz"

# Detener aplicación
docker-compose stop webapp

# Restaurar base de datos
gunzip -c $BACKUP_FILE | docker-compose exec -T postgres psql -U emma_user -d emma_db

# Reiniciar aplicación
docker-compose start webapp
```

---

## 🛠 Troubleshooting

### Problemas Comunes

#### 1. Error: "Can't connect to PostgreSQL"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar CONNECTION
docker-compose exec webapp npx prisma db push

# Reiniciar postgres
docker-compose restart postgres
```

#### 2. Error: "The datasource.url property is required"
```bash
# Asegurar que .env existe y tiene DATABASE_URL
cat .env | grep DATABASE_URL

# Verificar que docker-compose carga las variables
docker-compose exec webapp env | grep DATABASE

# Reiniciar todo desde cero
docker-compose down -v
docker-compose up -d
```

#### 3. Error: "SSL Certificate not found"
```bash
# Verificar certificados
ls -la deploy/nginx/ssl/live/descubre.emma.pe/

# Ver logs de certbot
docker-compose logs certbot

# Regenerar certificados
docker-compose run --rm certbot renew --force-renewal

# Reiniciar nginx
docker-compose restart nginx
```

#### 4. Error: "502 Bad Gateway"
```bash
# Verificar que webapp esté corriendo
docker-compose ps webapp

# Ver logs de nginx
docker-compose logs nginx

# Verificar configuración de nginx
docker-compose exec nginx nginx -t

# Reiniciar ambos servicios
docker-compose restart webapp nginx
```

#### 5. Rendimiento Lento
```bash
# Ver recursos disponibles
htop
df -h
docker stats

# Optimizar PostgreSQL
docker-compose exec postgres psql -U emma_user -d emma_db -c "ANALYZE;"

# Aumentar memoria de PostgreSQL si es necesario
# Editar docker-compose.yml y aumentar limits memory
```

### Ver Logs

```bash
# Todos los logs
docker-compose logs

# Con timestamps
docker-compose logs -f -t

# Solo errores
docker-compose logs | grep -i error

# Últimas líneas
docker-compose logs --tail=50
```

---

## 📊 Monitoreo Opcional

### Prometheus + Grafana

Crear `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: emma_prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - emma_network

  grafana:
    image: grafana/grafana:latest
    container_name: emma_grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - emma_network

volumes:
  grafana_data:

networks:
  emma_network:
    external: true
```

```bash
# Iniciar monitoreo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Acceder a Grafana
# http://localhost:3001 (admin/admin)
```

---

## ✅ Checklist de Setup Exitoso

- [ ] ✅ Docker y Docker Compose instalados
- [ ] ✅ DNS configurado correctamente
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Archivo .env.prod creado
- [ ] ✅ PostgreSQL corriendo y conectando
- [ ] ✅ Migraciones ejecutadas
- [ ] ✅ Seeders ejecutados
- [ ] ✅ Aplicación Next.js corriendo
- [ ] ✅ Nginx configurado y corriendo
- [ ] ✅ Certificados SSL obtenidos
- [ ] ✅ HTTPS funcionando
- [ ] ✅ Redirecciones HTTP→HTTPS funcionando
- [ ] ✅ Redirecciones www→no-www funcionando
- [ ] ✅ Backup automático configurado
- [ ] ✅ Monitoreo de salud configurado
- [ ] ✅ Certificados renewables automáticamente

---

## 📞 Soporte Rápido

Si encuentras problemas:

1. **Verificar logs**: `docker-compose logs -f`
2. **Verificar DNS**: `nslookup descubre.emma.pe`
3. **Verificar puertos**: `netstat -tulpn | grep -E ":80|:443"`
4. **Verificar SSL**: `openssl s_client -connect descubre.emma.pe:443`
5. **Reiniciar todo**: `docker-compose restart`

Para soporte técnico detallado, incluye:
- Output de `docker-compose ps`
- Logs relevantes de `docker-compose logs`
- Versión del SO y Docker
- Configuración DNS actual

---

**¡Tu aplicación EMMA está lista para producción!** 🎉
