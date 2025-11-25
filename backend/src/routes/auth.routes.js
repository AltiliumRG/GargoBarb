// ==========================================
// 📌 IMPORTS
// ==========================================
const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  register,
  login,
  googleAuth,
} = require("../controllers/auth.controller");

const {
  verifyToken,
  requireRole,
  refreshTokenController,
  logout,
} = require("../middleware/auth.middleware"); // ✔ tu middleware REAL

const upload = require("../middleware/upload.middleware");

const router = express.Router();

// ==========================================
// 📌 VALIDACIÓN GENERAL
// ==========================================
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map((e) => e.msg);
    return res.status(400).json({ error: extracted.join(", ") });
  }
  next();
};

// ==========================================
// 🟦 REGISTER (con imagen)
// ==========================================
router.post(
  "/register",
  upload.single("image"),
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio"),

    body("email").isEmail().withMessage("Debe ser un correo válido"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),

    body("role_id")
      .notEmpty()
      .withMessage("El rol es obligatorio (1=Admin, 2=Dueño, 3=Cliente)"),
  ],
  validateFields,
  register
);

// ==========================================
// 🟩 LOGIN NORMAL
// ==========================================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Debe ingresar un correo válido"),
    body("password").notEmpty().withMessage("Debe ingresar una contraseña"),
  ],
  validateFields,
  login
);

// ==========================================
// 🟨 LOGIN GOOGLE
// ==========================================
router.post("/google", googleAuth);

// ==========================================
// 🔄 REFRESH TOKEN
// ==========================================
router.post("/refresh-token", refreshTokenController);
router.get("/refresh", refreshTokenController); // usado por el frontend

// ==========================================
// 🚪 LOGOUT
// ==========================================
router.post("/logout", verifyToken, logout);

// ==========================================
// 🛡 RUTA PROTEGIDA (solo requiere token válido)
// ==========================================
router.get("/private", verifyToken, (req, res) => {
  res.json({
    message: "Ruta protegida OK",
    user: req.user,
  });
});

// ==========================================
// 🔒 RUTAS PROTEGIDAS POR ROL
// ==========================================
router.get("/admin-only", verifyToken, requireRole(1), (req, res) => {
  res.json({ message: "Bienvenido Admin", user: req.user });
});

router.get("/owner-only", verifyToken, requireRole(2), (req, res) => {
  res.json({ message: "Bienvenido Dueño de barbería", user: req.user });
});

router.get("/client-only", verifyToken, requireRole(3), (req, res) => {
  res.json({ message: "Bienvenido Cliente", user: req.user });
});

// Admin o Dueño
router.get("/admin-owner", verifyToken, requireRole(1, 2), (req, res) => {
  res.json({
    message: "Ruta para Admin y Dueños",
    user: req.user,
  });
});

module.exports = router;
