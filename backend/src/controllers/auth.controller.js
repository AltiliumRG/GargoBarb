// ============================================================
// 📁 backend/src/controllers/auth.controller.js
// ============================================================

const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const authService = require("../services/auth.service");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================================================
// 🍪 Función para enviar cookies seguras (access + refresh)
// ============================================================
const sendAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true, // cambiar a true en producción con HTTPS
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });
};

// ============================================================
// 🟦 REGISTRO
// ============================================================
exports.register = async (req, res) => {
  try {
    const { username, email, password, full_name, role_id } = req.body;

    let avatar_url = null;
    if (req.file) avatar_url = `/uploads/${req.file.filename}`;

    const user = await authService.register({
      username,
      email,
      password,
      full_name,
      role_id,
      avatar_url,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user,
    });
  } catch (error) {
    console.error("❌ Error en register:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================================
// 🔑 LOGIN NORMAL
// ============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      usernameOrEmail: email,
      password,
    });

    // Guardar hash del refresh token
    const hash = await bcrypt.hash(result.refreshToken, 10);
    await User.update(
      { refresh_token_hash: hash },
      { where: { id: result.user.id } }
    );

    // Enviar cookies
    sendAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({
      message: "Inicio de sesión exitoso",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================================
// 🔄 RENOVAR TOKENS (Refresh Token)
// ============================================================
exports.refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No hay refresh token" });
    }

    const result = await authService.refreshTokens(refreshToken);

    // Guardar nuevo hash
    const hash = await bcrypt.hash(result.refreshToken, 10);
    await User.update(
      { refresh_token_hash: hash },
      { where: { id: result.user.id } }
    );

    // Nuevas cookies
    sendAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({
      message: "Token renovado correctamente",
      user: result.user,
    });
  } catch (error) {
    console.error("❌ Error en refresh:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// ============================================================
// 🚪 LOGOUT
// ============================================================
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      await User.update(
        { refresh_token_hash: null },
        { where: { id: userId } }
      );
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("❌ Error en logout:", error.message);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

// ============================================================
// 🔐 LOGIN CON GOOGLE
// ============================================================
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Token de Google no recibido" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ where: { email } });

    // Si no existe → crear usuario nuevo
    if (!user) {
      user = await User.create({
        username: email.split("@")[0],
        email,
        full_name: name,
        avatar_url: picture,
        password_hash: null,
        role_id: 3,
      });
    }

    // Crear tokens
    const tokens = await authService.createTokens(user);

    // Guardar hash
    const hash = await bcrypt.hash(tokens.refreshToken, 10);
    user.refresh_token_hash = hash;
    await user.save();

    // Enviar cookies
    sendAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Enviar usuario limpio
    const safeUser = user.toJSON();
    delete safeUser.password_hash;
    delete safeUser.refresh_token_hash;

    res.json({
      message: "Google Auth exitoso",
      user: safeUser,
    });
  } catch (error) {
    console.error("❌ Error en Google Auth:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};
