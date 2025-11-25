// ============================================================
// 📁 backend/src/middleware/auth.middleware.js
// ============================================================
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ============================================================
// 🔐 1️⃣ VERIFICAR ACCESS TOKEN (15 min)
// ============================================================
exports.verifyToken = async (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "No hay token de acceso" });
  }

  try {
    // ⚠ Importante: en access token usamos SUB (sub: user.id)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.sub, {
      attributes: {
        exclude: ["password_hash", "refresh_token_hash"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Error verifyToken:", err.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// ============================================================
// 🔄 2️⃣ REFRESH TOKEN
// ============================================================
exports.refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "No hay refresh token" });
  }

  try {
    // ⚠ Refresh token también usa SUB
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findByPk(decoded.sub);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar hash del refresh token
    const isValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash
    );

    if (!isValid) {
      return res.status(403).json({ message: "Refresh token inválido" });
    }

    // Crear nuevo access token de 15 min
    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Setear cookie
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Nuevo access token generado" });
  } catch (err) {
    console.error("❌ Error refreshTokenController:", err.message);
    return res.status(403).json({ message: "Refresh token expirado o inválido" });
  }
};

// ============================================================
// 🚪 3️⃣ LOGOUT
// ============================================================
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        user.refresh_token_hash = null;
        await user.save();
      }
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("❌ Error logout:", err.message);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

// ============================================================
// 🛡 4️⃣ VALIDACIÓN DE ROLES
// ============================================================
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({
        message: "Acceso denegado: no tienes permiso",
      });
    }

    next();
  };
};

// ============================================================
// 🔓 5️⃣ PRIVATE ENDPOINT → Devuelve el usuario autenticado
// ============================================================
exports.private = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  res.json({
    message: "Sesión válida",
    user: req.user,
  });
};
