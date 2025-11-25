// ============================================================
// 📁 backend/src/utils/jwt.js
// ============================================================
const jwt = require("jsonwebtoken");

// Lee secretos desde .env
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Expiraciones (pueden venir de .env o por defecto)
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

/* ========================================================
   🔐 SIGN ACCESS TOKEN
   - Se usa para peticiones normales
   - Dura poco tiempo
======================================================== */
function signAccessToken(payload = {}, options = {}) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: options.expiresIn || ACCESS_EXPIRES,
  });
}

/* ========================================================
   🔐 SIGN REFRESH TOKEN
   - Dura mucho
   - Solo debe ir en cookie HttpOnly + DB encriptado
======================================================== */
function signRefreshToken(payload = {}, options = {}) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: options.expiresIn || REFRESH_EXPIRES,
  });
}

/* ========================================================
   🔍 VERIFY ACCESS TOKEN
======================================================== */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/* ========================================================
   🔍 VERIFY REFRESH TOKEN
======================================================== */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
