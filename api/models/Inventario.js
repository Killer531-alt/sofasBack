const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true, min: 0 },
    precio_unitario: { type: Number, required: true, min: 0 },
    unidad_medida: { type: String, required: true },
    proveedor: { type: String },
    punto_reorden: { type: Number, default: 5 },
    categoria: { type: String, required: true },
    fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventario', InventarioSchema);