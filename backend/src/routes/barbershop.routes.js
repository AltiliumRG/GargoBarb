// ✅ backend/src/routes/barbershop.routes.js
const express = require("express");
const router = express.Router();
const barbershopController = require("../controllers/barbershop.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

/**
 * 🧾 Rutas de Barberías
 * 
 * Roles:
 *  - Admin (role_id = 1): puede ver, crear, editar y eliminar todas.
 *  - Dueño (role_id = 2): puede ver y gestionar solo las suyas.
 *  - Cliente (role_id = 3): solo puede ver todas las barberías activas.
 */

// ✅ Middleware general — todas requieren autenticación
router.use(verifyToken);

/**
 * 🔹 Crear barbería
 * - Admin puede asignar un dueño (user_id)
 * - Dueño solo puede crear la suya
 */
router.post("/", requireRole(1, 2), barbershopController.createBarbershop);

/**
 * 🔹 Obtener barberías
 * - Admin → todas las barberías
 * - Dueño → solo las suyas
 * - Cliente → todas las barberías activas (solo lectura)
 */
router.get("/", barbershopController.getAllBarbershops);

/**
 * 🔹 Obtener una barbería por ID
 * - Admin puede ver cualquiera
 * - Dueño solo la suya
 * - Cliente puede verla si está activa
 */
router.get("/:id", barbershopController.getBarbershopById);

/**
 * 🔹 Actualizar barbería
 * - Admin o dueño de esa barbería
 */
router.put("/:id", requireRole(1, 2), barbershopController.updateBarbershop);

/**
 * 🔹 Eliminar barbería
 * - Solo admin
 */
router.delete("/:id", requireRole(1), barbershopController.deleteBarbershop);

module.exports = router;
