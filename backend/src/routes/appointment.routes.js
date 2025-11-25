// backend/src/routes/appointment.routes.js
const express = require('express');
const {
  createAppointment,
  getAppointments,
  updateStatus,
  deleteAppointment,
} = require('../controllers/appointment.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// 🔹 Crear cita (solo cliente)
router.post('/', verifyToken, requireRole(3), createAppointment);

// 🔹 Ver citas (dueños y admin)
router.get('/', verifyToken, requireRole(1, 2), getAppointments);

// 🔹 Actualizar estado (dueños o admin)
router.put('/:id/status', verifyToken, requireRole(1, 2), updateStatus);

// 🔹 Borrar cita (cliente o admin)
router.delete('/:id', verifyToken, requireRole(1, 3), deleteAppointment);

module.exports = router;
