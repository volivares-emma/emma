# Migraciones y Seed

## Variables requeridas
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`

## Comandos
```bash
# Generar migración desde cambios en entities
npm run migration:generate src/database/migrations/NombreCambio

# Solo desarrollo: crear/actualizar tablas sin migraciones
npm run schema:sync
## Uso
- Crea/actualiza todas las tablas desde las entidades sin usar migraciones.

# Aplicar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Seed de datos
npm run seed
```

## Nota
- En Docker, el backend ejecuta `npm run migration:run` al iniciar.
