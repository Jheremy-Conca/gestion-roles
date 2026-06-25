const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkRole');
const { roleRules, validar } = require('../validators/validators');

router.get('/', verifyToken, roleController.getRoles);
router.post('/', verifyToken, checkPermission('gestionar_roles'), roleRules, validar, roleController.createRole);
router.put('/:id', verifyToken, checkPermission('gestionar_roles'), roleController.updateRole);
router.delete('/:id', verifyToken, checkPermission('gestionar_roles'), roleController.deleteRole);

module.exports = router;