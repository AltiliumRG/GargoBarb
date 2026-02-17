const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Solo administradores pueden ver las estadísticas generales
router.get('/', verifyToken, requireRole(1), statsController.getStats);

module.exports = router;
