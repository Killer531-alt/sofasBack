const express = require('express');
const router = express.Router();
const Personalizacion = require('../models/Personalizacion');

// Create
router.post('/', async (req, res) => {
  try {
    const personalizacion = new Personalizacion(req.body);
    await personalizacion.save();
    res.status(201).json(personalizacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const personalizaciones = await Personalizacion.find();
    res.json(personalizaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const personalizacion = await Personalizacion.findById(req.params.id);
    if (!personalizacion) return res.status(404).json({ error: 'Not found' });
    res.json(personalizacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const personalizacion = await Personalizacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!personalizacion) return res.status(404).json({ error: 'Not found' });
    res.json(personalizacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const personalizacion = await Personalizacion.findByIdAndDelete(req.params.id);
    if (!personalizacion) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
