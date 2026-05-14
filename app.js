const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const frasesRoutes = require('./src/routes/frases');
const errorHandler = require('./src/middlewares/errorHandler');

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const viewsRoutes = require('./src/routes/views');
app.use('/', viewsRoutes);

app.use('/auth', authRoutes);
app.use('/frases', frasesRoutes);

// 404 para la API (Opcional, pero dejaremos que la vista lo maneje si no es API)
// Mejor lo dejamos para /api/* u otros que no existan, pero por ahora lo dejamos
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).render('404', { title: 'No Encontrado' });
    return;
  }
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejador de errores global
app.use(errorHandler);

module.exports = app;
