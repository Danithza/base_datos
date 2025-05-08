// backend/index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const { poolConnect } = require('./db/connection');
require('dotenv').config();

const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para JSON
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
poolConnect
  .then(() => console.log('✅ Conectado a SQL Server'))
  .catch(err => console.error('❌ Error al conectar con SQL Server:', err.message));

// Rutas de la API
app.use('/api/productos', require('./routes/productos'));

// Rutas del frontend (opcional si ya sirves estáticos, pero útil para control)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});
