const express = require('express');
const router = express.Router();
const Refaccion = require('../models/Refaccion');
const multer = require('multer');

// Use memory storage so we can convert buffer to base64 easily
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Create - accept multipart/form-data (imagen optional)
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      // Store as data URI (includes mime)
      data.imagen = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    const refaccion = new Refaccion(data);
    await refaccion.save();
    res.status(201).json(refaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const refacciones = await Refaccion.find().sort({ fecha_solicitud: -1 });
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

// Update (partial update)
router.put('/:id', async (req, res) => {
  try {
    const refaccion = await Refaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!refaccion) return res.status(404).json({ error: 'Not found' });
    res.json(refaccion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update estado
router.put('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['pendiente', 'en_proceso', 'completada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const refaccion = await Refaccion.findByIdAndUpdate(req.params.id, { estado, fecha_actualizacion: new Date() }, { new: true });
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
