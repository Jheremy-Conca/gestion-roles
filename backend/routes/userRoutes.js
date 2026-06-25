const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkRole');
const { userRules, userUpdateRules, validar } = require('../validators/validators');

router.get('/', verifyToken, checkPermission('leer'), userController.getUsers);
router.post('/', verifyToken, checkPermission('crear'), userRules, validar, userController.createUser);
router.put('/:id', verifyToken, checkPermission('actualizar'), userUpdateRules, validar, userController.updateUser);
router.delete('/:id', verifyToken, checkPermission('eliminar'), userController.deleteUser);

module.exports = router;