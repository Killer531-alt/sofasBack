const mongoose = require('mongoose');

const RefaccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  detalles: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refaccion', RefaccionSchema);