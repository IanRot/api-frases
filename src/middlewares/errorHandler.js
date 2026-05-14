// Manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de Sequelize: campo duplicado
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único.' });
  }

  // Error de validación Sequelize
  if (err.name === 'SequelizeValidationError') {
    const mensajes = err.errors.map(e => e.message);
    return res.status(400).json({ errores: mensajes });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor.',
  });
};

module.exports = errorHandler;
