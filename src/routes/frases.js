const router = require('express').Router();
const ctrl = require('../controllers/frasesController');
const { verificarToken } = require('../middlewares/auth');
const { validarFrase } = require('../middlewares/validate');

// Rutas públicas
router.get('/', ctrl.getAll);
router.get('/random', ctrl.getRandom);   // ANTES de /:id para que no lo capture como ID
router.get('/:id', ctrl.getById);

// Rutas protegidas (requieren JWT)
router.post('/', verificarToken, validarFrase, ctrl.create);
router.put('/:id', verificarToken, validarFrase, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);

module.exports = router;
