// backend/src/routes/upload.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const User = require("../models/User");

// POST /api/uploads/avatar  (form-data: avatar=file)
router.post("/avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se envió archivo." });

    // Construir URL pública
    const fileUrl = `${process.env.UPLOADS_URL || `${req.protocol}://${req.get("host")}/uploads`}/${req.file.filename}`;

    // Actualizar user
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    await user.update({ avatar_url: fileUrl });

    res.json({ message: "Avatar subido.", avatar_url: fileUrl });
  } catch (err) {
    console.error("Error upload avatar:", err);
    res.status(500).json({ error: "Error interno al subir avatar." });
  }
});

module.exports = router;
