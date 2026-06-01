const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const authenticateToken = require('../middleware/auth');

// Get all bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings ORDER BY booking_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  const { field_id, user_id, booking_date, start_time, end_time, total_price } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO bookings (field_id, user_id, booking_date, start_time, end_time, total_price, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [field_id, user_id, booking_date, start_time, end_time, total_price, 'confirmed']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking
router.put('/:id', authenticateToken, async (req, res) => {
  const { field_id, booking_date, start_time, end_time, total_price, status } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE bookings SET field_id = $1, booking_date = $2, start_time = $3, end_time = $4, total_price = $5, status = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [field_id, booking_date, start_time, end_time, total_price, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
