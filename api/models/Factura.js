const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
    numero_factura: { type: String, required: true, unique: true },
    fecha_emision: { type: Date, default: Date.now },
    cliente: {
        nombre: { type: String, required: true },
        correo: { type: String, required: true },
        telefono: { type: String, required: true },
        direccion: { type: String, required: true }
    },
    items: [{
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario' },
        cantidad: { type: Number, required: true },
        precio_unitario: { type: Number, required: true },
        subtotal: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    total: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'pagada', 'cancelada'], default: 'pendiente' },
    metodo_pago: { type: String, required: true },
    notas: { type: String }
});

// Middleware para generar número de factura automático
FacturaSchema.pre('save', async function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear();
        const count = await this.constructor.countDocuments();
        this.numero_factura = `F${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Factura', FacturaSchema);