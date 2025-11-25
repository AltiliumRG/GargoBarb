require('dotenv').config();
const { testConnection, sequelize } = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await testConnection();
    console.log('✅ Conectado a MySQL (Sequelize).');

    await sequelize.authenticate();

    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
  }
})();
