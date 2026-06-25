const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// LOGIN
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario (SIN filtrar por activo, para detectar si está desactivado)
    const result = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre, r.permisos 
       FROM usuarios u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];

    // ⭐ VERIFICAR SI ESTÁ DESACTIVADO
    if (!usuario.activo) {
      return res.status(403).json({
        message: 'Tu cuenta está desactivada. Contacta al administrador.'
      });
    }

    // Comparar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol_nombre,
        permisos: usuario.permisos
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol_nombre,
        permisos: usuario.permisos
      }
    });
  } catch (error) {
    next(error);
  }
};

// REGISTRO
exports.register = async (req, res, next) => {
  const { nombre, email, password, role_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, role_id) 
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, email`,
      [nombre, email, hashedPassword, role_id || 3]
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    next(error);
  }
};