const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
  res.json({ message: 'API del Zoológico Mirada Salvaje' });
});

// Rutas de la API (se añadirán más adelante)
app.use('/api/cleaning', require('./routes/cleaningRoutes'));
app.use('/api/feeding', require('./routes/feedingRoutes'));
app.use('/api/clinical', require('./routes/clinicalRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;