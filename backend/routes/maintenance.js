const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const authenticateToken = require('../middleware/auth');

// Get all maintenance tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM maintenance_tasks ORDER BY scheduled_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get maintenance task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM maintenance_tasks WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create maintenance task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, field_id, task_type, scheduled_date, priority, assigned_to } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO maintenance_tasks (title, description, field_id, task_type, scheduled_date, priority, assigned_to, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, field_id, task_type, scheduled_date, priority, assigned_to, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update maintenance task
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, field_id, task_type, scheduled_date, priority, assigned_to, status, completed_date } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE maintenance_tasks SET title = $1, description = $2, field_id = $3, task_type = $4, scheduled_date = $5, priority = $6, assigned_to = $7, status = $8, completed_date = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [title, description, field_id, task_type, scheduled_date, priority, assigned_to, status, completed_date, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete maintenance task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM maintenance_tasks WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
