require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida.');

    // Sincronizar modelos (no uses force: true en producción)
    await sequelize.sync();
    console.log('✅ Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
};

start();
