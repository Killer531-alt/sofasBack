const mongoose = require('mongoose');

const PersonalizacionSchema = new mongoose.Schema({
  cat_nombre: { type: String, required: true },
  cat_correo: { type: String, required: true },
  cat_telefono: { type: String, required: true },
  cat_producto: { type: String, required: true },
  cat_tela: { type: String, required: true },
  cat_madera: { type: String, required: true },
  cat_color_diseno: { type: String, required: true },
  // Allow mixed types for the image field to avoid cast errors when frontend
  // accidentally sends a File object; prefer storing base64 string or file path.
  cat_diseno_img: { type: mongoose.Schema.Types.Mixed, default: null },
  cat_direccion: { type: String, required: true },
  cat_ciudad: { type: String, required: true },
  cat_acceso: { type: String },
  cat_recibe: { type: String, required: true },
  cat_metodo_pago: { type: String, required: true },
  cat_dinamica_pago: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Personalizacion', PersonalizacionSchema);