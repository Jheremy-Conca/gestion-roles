const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { enviarEmailRecuperacion } = require('../config/email'); // ⭐ NUEVO

// SOLICITAR RECUPERACIÓN
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    // Por seguridad, siempre respondemos igual
    if (result.rows.length === 0) {
      return res.json({
        message: 'Si el email existe, recibirás instrucciones de recuperación'
      });
    }

    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await pool.query(
      `UPDATE usuarios 
       SET reset_token = $1, reset_token_expira = $2 
       WHERE email = $3`,
      [token, expira, email]
    );

    // Crear enlace
    const enlace = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // ⭐ ENVIAR EMAIL REAL
    await enviarEmailRecuperacion(email, enlace);

    res.json({
      message: 'Email de recuperación enviado correctamente. Revisa tu bandeja de entrada.'
    });
  } catch (error) {
    console.error('Error al enviar email:', error.message);
    next(error);
  }
};

// RESTABLECER CONTRASEÑA
exports.resetPassword = async (req, res, next) => {
  const { token, nuevaPassword } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM usuarios 
       WHERE reset_token = $1 AND reset_token_expira > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Token inválido o expirado'
      });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await pool.query(
      `UPDATE usuarios 
       SET password = $1, reset_token = NULL, reset_token_expira = NULL 
       WHERE reset_token = $2`,
      [hashedPassword, token]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};