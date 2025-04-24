const express = require('express');
const path = require('path');
const cors = require('cors'); // 👈 Importamos CORS
const { poolConnect } = require('./db/connection');
require('dotenv').config();

const app = express();

// ✅ Habilitamos CORS para permitir peticiones desde otros orígenes (como 127.0.0.1:5500)
app.use(cors());

// Conexión a la base de datos
poolConnect
  .then(() => console.log('✅ Conectado a SQL Server'))
  .catch(err => console.error('❌ Error al conectar con SQL Server:', err.message));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API - Productos
app.use('/api/productos', require('./routes/productos'));

// Rutas del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});
