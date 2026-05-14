const { Frase, Usuario } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const incluirAutor = { model: Usuario, as: 'autor', attributes: ['id', 'nombre'] };

// GET /frases  (con ?tipo= opcional)
const getAll = async (req, res, next) => {
  try {
    const where = req.query.tipo ? { tipo: req.query.tipo } : {};
    const frases = await Frase.findAll({ where, include: [incluirAutor] });
    res.json(frases);
  } catch (err) {
    next(err);
  }
};

// GET /frases/random  (con ?tipo= opcional)
const getRandom = async (req, res, next) => {
  try {
    const where = req.query.tipo ? { tipo: req.query.tipo } : {};
    const frase = await Frase.findOne({
      where,
      include: [incluirAutor],
      order: sequelize.random(),
    });

    if (!frase) {
      return res.status(404).json({ error: 'No se encontró ninguna frase con ese criterio.' });
    }
    res.json(frase);
  } catch (err) {
    next(err);
  }
};

// GET /frases/:id
const getById = async (req, res, next) => {
  try {
    const frase = await Frase.findByPk(req.params.id, { include: [incluirAutor] });
    if (!frase) return res.status(404).json({ error: 'Frase no encontrada.' });
    res.json(frase);
  } catch (err) {
    next(err);
  }
};

// POST /frases
const create = async (req, res, next) => {
  try {
    const { texto, tipo } = req.body;
    const frase = await Frase.create({ texto, tipo, usuarioId: req.usuario.id });
    res.status(201).json({ mensaje: 'Frase creada.', frase });
  } catch (err) {
    next(err);
  }
};

// PUT /frases/:id
const update = async (req, res, next) => {
  try {
    const frase = await Frase.findByPk(req.params.id);
    if (!frase) return res.status(404).json({ error: 'Frase no encontrada.' });

    // Solo el dueño o un admin puede editar
    if (frase.usuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para editar esta frase.' });
    }

    const { texto, tipo } = req.body;
    await frase.update({ texto, tipo });
    res.json({ mensaje: 'Frase actualizada.', frase });
  } catch (err) {
    next(err);
  }
};

// DELETE /frases/:id
const remove = async (req, res, next) => {
  try {
    const frase = await Frase.findByPk(req.params.id);
    if (!frase) return res.status(404).json({ error: 'Frase no encontrada.' });

    // Solo el dueño o un admin puede eliminar
    if (frase.usuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta frase.' });
    }

    await frase.destroy();
    res.json({ mensaje: 'Frase eliminada.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getRandom, getById, create, update, remove };
