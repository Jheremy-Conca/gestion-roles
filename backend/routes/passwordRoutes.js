const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const { body } = require('express-validator');
const { validar } = require('../validators/validators');

router.post('/forgot',
  [body('email').isEmail().withMessage('Email inválido')],
  validar,
  passwordController.forgotPassword
);

router.post('/reset',
  [body('nuevaPassword').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')],
  validar,
  passwordController.resetPassword
);

module.exports = router;