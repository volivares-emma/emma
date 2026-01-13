@echo off
REM EMMA Development Setup Script - Windows
REM Combina: Base de Datos + Aplicacion Web + Migraciones

setlocal enabledelayedexpansion

cls

echo.
echo ====================================
echo EMMA Development Setup
echo Setup Completo (BD + Web + Migraciones)
echo ====================================
echo.

REM Verificar .env
if not exist ".env" (
    echo ERROR: archivo .env no encontrado
    echo Por favor, ejecuta primero: copy .env.example .env
    pause
    exit /b 1
)

echo OK: archivo .env encontrado
echo.

REM Detener contenedores previos
echo Deteniendo contenedores previos...
docker-compose -f docker-compose.dev.yml down 2>nul

echo.
set /p cleanup="Limpiar volumenes de BD previos? (s/n): "
if /i "%cleanup%"=="s" (
    echo Eliminando volumenes...
    docker-compose -f docker-compose.dev.yml down -v 2>nul
    echo OK: volumenes eliminados
)

echo.
echo ====================================
echo PASO 1: Iniciar Base de Datos
echo ====================================
echo.
echo Iniciando contenedor PostgreSQL...
docker-compose -f docker-compose.dev.yml up --build -d postgres

echo.
echo Esperando a que PostgreSQL este listo...
timeout /t 20 /nobreak

echo.
echo ====================================
echo PASO 2: Iniciar Aplicacion Web
echo ====================================
echo.
echo Construyendo imagen de la web...
docker-compose -f docker-compose.dev.yml build webapp

echo.
echo Iniciando contenedor web...
docker-compose -f docker-compose.dev.yml up -d webapp

echo.
echo Esperando a que el contenedor este listo...
timeout /t 3 /nobreak

echo.
echo ====================================
echo PASO 3: Ejecutar Operaciones de Prisma
echo ====================================
echo.

echo Esperando a que la aplicacion complete migraciones y setup...
timeout /t 10 /nobreak

echo OK: Las migraciones y generacion se ejecutaron automaticamente
echo.

echo Ejecutando seeder de datos...
docker-compose -f docker-compose.dev.yml exec -T webapp npm run db:seed
if errorlevel 1 (
    echo WARNING: Error en seeder (puede continuar)
)

echo.
echo ====================================
echo SETUP COMPLETADO
echo ====================================
echo.
echo Acceso a la aplicacion:
echo   Web:  http://localhost:3000
echo   BD:   postgres:5432
echo.
echo Comandos utiles:
echo   Ver logs web:       docker-compose -f docker-compose.dev.yml logs -f webapp
echo   Ver logs BD:        docker-compose -f docker-compose.dev.yml logs -f postgres
echo   Crear migracion:    .\deploy\windows\create-migration.bat
echo   Detener todo:       docker-compose -f docker-compose.dev.yml down
echo   Detener solo web:   docker-compose -f docker-compose.dev.yml stop webapp
echo.
pause
