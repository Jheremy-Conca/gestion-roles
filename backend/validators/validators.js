const { body, validationResult } = require('express-validator');

// Middleware que revisa errores
exports.validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      message: errores.array()[0].msg, // Primer error
      errores: errores.array().map(e => e.msg)
    });
  }
  next();
};

// Reglas para LOGIN
exports.loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

// Reglas para CREAR USUARIO ⭐ MÁS ESTRICTAS
exports.userRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role_id')
    .notEmpty().withMessage('El rol es obligatorio')
    .isInt().withMessage('Rol inválido')
];

// Reglas para ACTUALIZAR USUARIO ⭐ NUEVO
exports.userUpdateRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('role_id')
    .notEmpty().withMessage('El rol es obligatorio')
    .isInt().withMessage('Rol inválido'),
  body('activo')
    .isBoolean().withMessage('Estado inválido')
];

// Reglas para CREAR ROL
exports.roleRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del rol es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('permisos')
    .isArray({ min: 1 }).withMessage('Debe seleccionar al menos un permiso')
];