const mongoose = require('mongoose');

const RefaccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  detalles: { type: String, required: true },
  // Store uploaded image as base64 data URI (optional)
  imagen: { type: String, default: null },
  estado: { type: String, enum: ['pendiente', 'en_proceso', 'completada'], default: 'pendiente' },
  notas_admin: { type: String, default: '' },
  fecha_solicitud: { type: Date, default: Date.now },
  fecha_actualizacion: { type: Date }
});

// Update fecha_actualizacion on save
RefaccionSchema.pre('save', function(next) {
  this.fecha_actualizacion = new Date();
  next();
});

module.exports = mongoose.model('Refaccion', RefaccionSchema);