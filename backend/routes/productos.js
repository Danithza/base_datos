const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { pool } = require('../db/connection');

// Ruta para obtener productos (con filtros opcionales) - YA FUNCIONA
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM PRODUCTOS';
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

// Ruta para obtener un producto por ID - CORREGIDA
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea numérico
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM PRODUCTOS WHERE id_producto = @id'); // Cambiado a id_productor

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(`❌ Error al obtener producto con ID ${req.params.id}:`, err.message);
    res.status(500).json({ 
      error: 'Error al obtener el producto',
      details: err.message
    });
  }
});

// Agrega esta ruta a tu backend/routes/productos.js
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser numérico' });
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.VarChar, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock)
      .input('categoria', sql.VarChar, categoria)
      .query(`
        UPDATE PRODUCTOS 
        SET nombre = @nombre, 
            descripcion = @descripcion, 
            precio = @precio, 
            stock = @stock, 
            categoria = @categoria
        WHERE id_producto = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      details: err.message
    });
  }
});

module.exports = router;