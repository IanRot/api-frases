const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Frase = require('./Frase');

Usuario.hasMany(Frase, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Frase.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'autor', attributes: ['id', 'nombre'] });

module.exports = { sequelize, Usuario, Frase };
