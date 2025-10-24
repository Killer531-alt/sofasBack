require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true,
  optionsSuccessStatus: 204 // Para navegadores antiguos y algunos SmartTVs
}));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
app.use('/api/refaccion', require('./routes/refaccion'));
app.use('/api/cita', require('./routes/cita'));
app.use('/api/personalizacion', require('./routes/personalizacion'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/factura', require('./routes/factura'));

app.get('/', (req, res) => {
  res.send('Orlando Ortiz Muebles API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
