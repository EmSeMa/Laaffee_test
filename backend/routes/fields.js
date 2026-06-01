const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const authenticateToken = require('../middleware/auth');

// Get all fields
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fields ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get field by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fields WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create field (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { name, type, location, price_per_hour, capacity } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO fields (name, type, location, price_per_hour, capacity, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, location, price_per_hour, capacity, true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update field
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, type, location, price_per_hour, capacity, is_available } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE fields SET name = $1, type = $2, location = $3, price_per_hour = $4, capacity = $5, is_available = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, type, location, price_per_hour, capacity, is_available, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete field
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM fields WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json({ message: 'Field deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
