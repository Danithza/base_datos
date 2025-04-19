const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT),
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });

    const result = await pool.request().query('SELECT * FROM productos');
    res.json(result.recordset);

  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
