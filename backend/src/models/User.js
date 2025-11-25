// ============================================================
// 📁 backend/src/models/User.js
// ============================================================
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
      validate: {
        isEmail: {
          msg: "Debe ser un correo válido.",
        },
      },
    },

    // 🔐 Contraseña cifrada (puede ser null para usuarios Google)
    password_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 🧑‍💼 Rol del usuario
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3, // 1=admin, 2=barber, 3=client
    },

    // 🖼️ Avatar
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 🔐 Guardará el refresh token encriptado (sha256 → 64 chars)
    refresh_token_hash: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
