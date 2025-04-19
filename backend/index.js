const { poolConnect } = require('./db/connection');
const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

// 👇 Aquí ejecutamos la conexión
poolConnect
  .then(() => console.log('✅ Conectado a SQL Server'))
  .catch(err => console.error('❌ Error al conectar con SQL Server:', err.message));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/productos', require('./routes/productos'));

// Rutas Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});
