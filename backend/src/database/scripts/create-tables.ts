import { AppDataSource } from '../data-source';

async function createTables() {
  try {
    console.log('🔄 Inicializando conexión a la base de datos...');

    // Inicializar con synchronize: true para crear las tablas
    const dataSource = AppDataSource.setOptions({
      synchronize: true,
      dropSchema: false,
    });

    await dataSource.initialize();
    console.log('Conexión establecida');

    console.log('Sincronizando esquema de base de datos...');
    await dataSource.synchronize();
    console.log('Tablas creadas/actualizadas exitosamente');

    await dataSource.destroy();
    console.log('Proceso completado');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
    process.exit(1);
  }
}

void createTables();
