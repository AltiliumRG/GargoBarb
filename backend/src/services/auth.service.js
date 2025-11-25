// ============================================================
// 📁 backend/src/services/auth.service.js
// ============================================================
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const User = require("../models/User");
const jwtUtil = require("../utils/jwt"); // signAccessToken, signRefreshToken, verifyRefreshToken

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

// ============================================================
// 🔐 Hash seguro de refresh token (bcrypt)
// ============================================================
async function hashRefreshToken(token) {
  return await bcrypt.hash(token, SALT_ROUNDS);
}

// ============================================================
// 🔐 Verificar contraseña
// ============================================================
async function verifyPassword(plain, hash) {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

// ============================================================
// 🔐 Crear access + refresh tokens
// ============================================================
async function createTokens(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    role_id: user.role_id,
  };

  const accessToken = jwtUtil.signAccessToken(payload);
  const refreshToken = jwtUtil.signRefreshToken(payload);

  return { accessToken, refreshToken };
}

// ============================================================
// 📌 REGISTRO
// ============================================================
async function register({
  username,
  email,
  password,
  full_name = null,
  avatar_url = null,
  role_id = 3,
}) {
  if (!username || !email) {
    const err = new Error("username y email son obligatorios.");
    err.status = 400;
    throw err;
  }

  const existing = await User.findOne({
    where: { [Op.or]: [{ username }, { email }] },
  });

  if (existing) {
    const err = new Error("El username o email ya están en uso.");
    err.status = 409;
    throw err;
  }

  let password_hash = null;
  if (password) {
    password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  const user = await User.create({
    username,
    email,
    password_hash,
    full_name,
    avatar_url,
    role_id,
  });

  const safeUser = user.toJSON();
  delete safeUser.password_hash;
  delete safeUser.refresh_token_hash;

  return safeUser;
}

// ============================================================
// 🔑 LOGIN
// ============================================================
async function login({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    const err = new Error("Credenciales incompletas.");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!user) {
    const err = new Error("Usuario o contraseña inválidos.");
    err.status = 401;
    throw err;
  }

  if (!user.password_hash) {
    const err = new Error("El usuario no tiene contraseña (login por Google).");
    err.status = 403;
    throw err;
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    const err = new Error("Usuario o contraseña inválidos.");
    err.status = 401;
    throw err;
  }

  const { accessToken, refreshToken } = await createTokens(user);

  // 👉 Guardar token hasheado correctamente
  user.refresh_token_hash = await hashRefreshToken(refreshToken);
  await user.save();

  const safeUser = user.toJSON();
  delete safeUser.password_hash;
  delete safeUser.refresh_token_hash;

  return { user: safeUser, accessToken, refreshToken };
}

// ============================================================
// 🔄 REFRESH TOKEN
// ============================================================
async function refreshTokens(providedRefreshToken) {
  if (!providedRefreshToken) {
    const err = new Error("Refresh token no proporcionado.");
    err.status = 400;
    throw err;
  }

  let decoded;
  try {
    decoded = jwtUtil.verifyRefreshToken(providedRefreshToken);
  } catch (e) {
    const err = new Error("Refresh token inválido o expirado.");
    err.status = 401;
    throw err;
  }

  const user = await User.findByPk(decoded.sub);

  if (!user) {
    const err = new Error("Usuario no encontrado.");
    err.status = 404;
    throw err;
  }

  // 👉 Comparación correcta usando bcrypt
  const isValid = await bcrypt.compare(
    providedRefreshToken,
    user.refresh_token_hash
  );

  if (!isValid) {
    user.refresh_token_hash = null;
    await user.save();

    const err = new Error("Refresh token inválido.");
    err.status = 401;
    throw err;
  }

  // Crear nuevos tokens
  const { accessToken, refreshToken } = await createTokens(user);

  // Guardar nuevo refresh token en BD
  user.refresh_token_hash = await hashRefreshToken(refreshToken);
  await user.save();

  const safeUser = user.toJSON();
  delete safeUser.password_hash;
  delete safeUser.refresh_token_hash;

  return { user: safeUser, accessToken, refreshToken };
}

// ============================================================
// 🚪 LOGOUT
// ============================================================
async function logout(userId) {
  const user = await User.findByPk(userId);
  if (!user) return;

  // ❗ Eliminar refresh token en BD
  user.refresh_token_hash = null;
  await user.save();
}

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
  verifyPassword,
  hashRefreshToken,
  createTokens,
};
