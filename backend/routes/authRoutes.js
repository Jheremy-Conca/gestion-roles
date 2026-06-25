const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginRules, userRules, validar } = require('../validators/validators');

router.post('/login', loginRules, validar, authController.login);
router.post('/register', userRules, validar, authController.register);

module.exports = router;