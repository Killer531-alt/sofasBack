const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');
const Inventario = require('../models/Inventario');
const pdfGenerator = require('../services/pdfGenerator');

// Create - Generar nueva factura
router.post('/', async (req, res) => {
    try {
        // Validar y actualizar inventario
        for (const item of req.body.items) {
            const producto = await Inventario.findById(item.producto);
            if (!producto) {
                return res.status(404).json({ error: `Producto con ID ${item.producto} no encontrado` });
            }
            if (producto.cantidad < item.cantidad) {
                return res.status(400).json({ 
                    error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidad}`
                });
            }
        }

        const factura = new Factura(req.body);
        await factura.save();

        // Actualizar inventario
        for (const item of req.body.items) {
            await Inventario.findByIdAndUpdate(
                item.producto,
                { $inc: { cantidad: -item.cantidad } }
            );
        }

        res.status(201).json(factura);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all - Obtener todas las facturas
router.get('/', async (req, res) => {
    try {
        const facturas = await Factura.find().populate('items.producto');
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one - Obtener una factura específica
router.get('/:id', async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id).populate('items.producto');
        if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(factura);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update - Actualizar estado de factura
router.put('/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;
        if (!['pendiente', 'pagada', 'cancelada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const factura = await Factura.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );

        if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(factura);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete - Cancelar factura
router.delete('/:id', async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });

        // Si la factura está pagada, devolver el inventario
        if (factura.estado === 'pagada') {
            for (const item of factura.items) {
                await Inventario.findByIdAndUpdate(
                    item.producto,
                    { $inc: { cantidad: item.cantidad } }
                );
            }
        }

        await factura.remove();
        res.json({ message: 'Factura cancelada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Additional endpoint - Get facturas by date range
router.get('/rango/:inicio/:fin', async (req, res) => {
    try {
        const facturas = await Factura.find({
            fecha_emision: {
                $gte: new Date(req.params.inicio),
                $lte: new Date(req.params.fin)
            }
        }).populate('items.producto');
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generar PDF de factura
router.get('/:id/pdf', async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id).populate('items.producto');
        if (!factura) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        // Generar el PDF
        const pdfPath = await pdfGenerator.generateFacturaPDF(factura);
        
        // Enviar el archivo
        res.download(pdfPath, `factura-${factura.numero_factura}.pdf`, (err) => {
            if (err) {
                console.error('Error al enviar el PDF:', err);
            }
            // Limpiar PDFs antiguos después de la descarga
            pdfGenerator.cleanupOldPDFs();
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;