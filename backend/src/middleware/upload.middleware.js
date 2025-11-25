const multer = require("multer");
const path = require("path");

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ej: 1731413055123.png
  },
});

// Filtrar tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no permitido"));
  }
};

module.exports = multer({ storage, fileFilter });
