const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validarRegistro, validarLogin } = require('../middlewares/validate');

router.post('/register', validarRegistro, register);
router.post('/login', validarLogin, login);

module.exports = router;
