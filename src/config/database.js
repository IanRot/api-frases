const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    // Necesario si usas servicios en la nube (Railway, Supabase, Render, etc.)
    ssl: process.env.DB_SSL === 'true'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
});

module.exports = sequelize;
