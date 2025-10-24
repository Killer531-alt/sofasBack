const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario');

// Create - Agregar nuevo material al inventario
router.post('/', async (req, res) => {
    try {
        const inventario = new Inventario(req.body);
        await inventario.save();
        res.status(201).json(inventario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all - Obtener todo el inventario
router.get('/', async (req, res) => {
    try {
        const inventario = await Inventario.find();
        res.json(inventario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one - Obtener un material específico
router.get('/:id', async (req, res) => {
    try {
        const material = await Inventario.findById(req.params.id);
        if (!material) return res.status(404).json({ error: 'Material no encontrado' });
        res.json(material);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update - Actualizar material
router.put('/:id', async (req, res) => {
    try {
        const material = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!material) return res.status(404).json({ error: 'Material no encontrado' });
        res.json(material);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete - Eliminar material
router.delete('/:id', async (req, res) => {
    try {
        const material = await Inventario.findByIdAndDelete(req.params.id);
        if (!material) return res.status(404).json({ error: 'Material no encontrado' });
        res.json({ message: 'Material eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Additional endpoint - Search by category
router.get('/categoria/:categoria', async (req, res) => {
    try {
        const materiales = await Inventario.find({ categoria: req.params.categoria });
        res.json(materiales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Additional endpoint - Low stock alert
router.get('/alerta/bajo-stock', async (req, res) => {
    try {
        const materialesBajos = await Inventario.find({
            $expr: {
                $lte: ['$cantidad', '$punto_reorden']
            }
        });
        res.json(materialesBajos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;