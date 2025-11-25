const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * 🔹 Obtener usuarios (con filtro opcional por rol)
 * Ejemplo:
 * - /api/users               → todos los usuarios
 * - /api/users?role=2        → solo dueños
 */
exports.getAllUsersFiltered = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role_id: parseInt(role) } : {};

    const users = await User.findAll({
      where,
      attributes: ["id", "username", "full_name", "email", "role_id"],
      order: [["full_name", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

/**
 * 🔹 Obtener usuario por ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "full_name", "email", "role_id"],
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

/**
 * 🔹 Crear nuevo usuario
 */
exports.createUser = async (req, res) => {
  try {
    let { username, full_name, email, password, role_id } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "El correo y la contraseña son obligatorios" });
    }

    // Generar username si no se envía
    if (!username) {
      username = full_name
        ? full_name.split(" ")[0].toLowerCase() + Math.floor(Math.random() * 1000)
        : email.split("@")[0];
    }

    // Rol por defecto si no se envía
    if (!role_id) role_id = 3; // Cliente por defecto

    // Verificar si ya existe el correo
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      username,
      full_name,
      email,
      password_hash: hashedPassword,
      role_id,
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        email: newUser.email,
        role_id: newUser.role_id,
      },
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(400).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

/**
 * 🔹 Actualizar usuario
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const requester = req.user; // se puede usar si tienes auth JWT
    if (requester && requester.role_id !== 1 && requester.id !== user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este usuario" });
    }

    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    await user.update(updateData);

    res.json({
      message: "Usuario actualizado correctamente",
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(400).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

/**
 * 🔹 Eliminar usuario
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const requester = req.user;
    if (requester && requester.role_id !== 1 && requester.id !== user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este usuario" });
    }

    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};
