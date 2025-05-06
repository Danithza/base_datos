// backend/routes/productos.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { pool } = require('../db/connection');

// Ruta para obtener productos (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM Productos';
    const { categoria, search } = req.query;

    if (categoria || search) {
      query += ' WHERE';
      const conditions = [];

      if (categoria) {
        conditions.push(` categoria = @categoria `);
      }
      if (search) {
        conditions.push(` nombre LIKE '%' + @search + '%' `);
      }

      query += conditions.join(' AND ');
    }

    const request = pool.request();

    if (categoria) request.input('categoria', sql.VarChar, categoria);
    if (search) request.input('search', sql.VarChar, search);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err.message);
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
