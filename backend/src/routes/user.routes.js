const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const User = require('../models/User');

// ✅ Obtener todos los usuarios (solo admin)
// Puedes pasar ?role=2 para filtrar por barberos o dueños
router.get('/', verifyToken, requireRole(1), userController.getAllUsersFiltered);

// ✅ Nueva ruta: Obtener todos los dueños (rol = 2)
router.get('/owners', verifyToken, requireRole(1), async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role_id: 2 },
      attributes: ['id', 'full_name', 'email'],
    });
    res.json(owners);
  } catch (error) {
    console.error('❌ Error al obtener dueños:', error);
    res.status(500).json({ error: 'Error al obtener dueños' });
  }
});

// ✅ Obtener usuario por ID (autenticado)
router.get('/:id', verifyToken, userController.getUserById);

// ✅ Crear usuario (registro o admin)
router.post('/', userController.createUser);

// ✅ Actualizar usuario (propio o admin)
router.put('/:id', verifyToken, userController.updateUser);

// ✅ Eliminar usuario (solo admin)
router.delete('/:id', verifyToken, requireRole(1), userController.deleteUser);

module.exports = router;
