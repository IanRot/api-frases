const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, codigoAdmin } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
    }

    const hash = await bcrypt.hash(password, 10);
    
    // Si envían el código secreto correcto, se registran como admin
    const rol = (codigoAdmin === 'admin123') ? 'admin' : 'user';
    
    const usuario = await Usuario.create({ nombre, email, password: hash, rol });

    res.status(201).json({
      mensaje: 'Usuario creado con éxito.',
      usuarioId: usuario.id,
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      mensaje: 'Login exitoso.',
      token,
      rol: usuario.rol,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
