const express = require('express');
const router = express.Router();
const Refaccion = require('../models/Refaccion');

// Create
router.post('/', async (req, res) => {
  try {
    const refaccion = new Refaccion(req.body);
    await refaccion.save();
    res.status(201).json(refaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const refacciones = await Refaccion.find();
    res.json(refacciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const refaccion = await Refaccion.findById(req.params.id);
    if (!refaccion) return res.status(404).json({ error: 'Not found' });
    res.json(refaccion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const refaccion = await Refaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!refaccion) return res.status(404).json({ error: 'Not found' });
    res.json(refaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const refaccion = await Refaccion.findByIdAndDelete(req.params.id);
    if (!refaccion) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
