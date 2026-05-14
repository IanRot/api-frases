const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Frase = sequelize.define('Frase', {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { tableName: 'frases' });

module.exports = Frase;
