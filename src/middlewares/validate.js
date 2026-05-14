// Valida los campos requeridos para crear/actualizar una frase
const validarFrase = (req, res, next) => {
  const { texto, tipo } = req.body;
  const errores = [];

  if (!texto || texto.trim() === '') errores.push('El campo "texto" es obligatorio.');
  if (!tipo || tipo.trim() === '') errores.push('El campo "tipo" es obligatorio.');

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  next();
};

// Valida los campos de registro
const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body;
  const errores = [];

  if (!nombre || nombre.trim() === '') errores.push('El campo "nombre" es obligatorio.');
  if (!email || email.trim() === '') errores.push('El campo "email" es obligatorio.');
  if (!password || password.trim() === '') errores.push('El campo "password" es obligatorio.');
  if (password && password.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres.');

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  next();
};

// Valida los campos de login
const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios.' });
  }
  next();
};

module.exports = { validarFrase, validarRegistro, validarLogin };
