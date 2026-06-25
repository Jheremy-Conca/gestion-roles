const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// === SEGURIDAD ===
app.use(helmet()); // Headers de seguridad

// CORS - solo permite el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json()); // Parsear JSON

// Rate limiting en login (máx 5 intentos cada 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiados intentos. Intenta en 15 minutos.' }
});
app.use('/api/auth/login', loginLimiter);
const passwordRoutes = require('./routes/passwordRoutes');
// ... después de las otras rutas:
app.use('/api/password', passwordRoutes);
// === RUTAS ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Gestión de Roles funcionando 🚀' });
});

// === MANEJO DE ERRORES (siempre al final) ===
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

module.exports = app;