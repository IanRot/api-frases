const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Inicio - API de Frases' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrarse' });
});

router.get('/crear-frase', (req, res) => {
  res.render('phrase-form', { title: 'Crear Frase', isEdit: false });
});

router.get('/editar-frase/:id', (req, res) => {
  res.render('phrase-form', { title: 'Editar Frase', isEdit: true, phraseId: req.params.id });
});

module.exports = router;
