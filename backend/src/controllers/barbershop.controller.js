const Barbershop = require("../models/Barbershop");
const User = require("../models/User");

/* ============================================================
   📍 Crear barbería (ADMIN o DUEÑO)
============================================================ */
exports.createBarbershop = async (req, res) => {
  try {
    const { name, address, city, user_id } = req.body;
    const user = req.user;

    console.log("📥 BODY:", req.body);
    console.log("👤 USER:", req.user);

    if (!name || !address || !city) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    let assignedUserId;

    // 👑 ADMIN → puede asignar dueño (rol 2)
    if (user.role_id === 1) {
      if (!user_id) {
        return res.status(400).json({ error: "Debe seleccionar un dueño para la barbería" });
      }

      const owner = await User.findByPk(user_id);
      if (!owner) return res.status(404).json({ error: "El usuario asignado no existe" });

      if (owner.role_id !== 2) {
        return res.status(400).json({ error: "El usuario asignado debe tener rol de dueño" });
      }

      assignedUserId = owner.id;
    }

    // 👤 DUEÑO → solo puede crear una barbería propia
    else if (user.role_id === 2) {
      const existing = await Barbershop.findOne({ where: { user_id: user.id } });
      if (existing) {
        return res.status(400).json({
          error: "Ya tienes una barbería registrada. Solo puedes tener una.",
        });
      }
      assignedUserId = user.id;
    }

    // 🚫 Otros roles → sin permisos
    else {
      return res.status(403).json({ error: "No tienes permisos para crear barberías" });
    }

    // ✅ Crear barbería
    const newBarbershop = await Barbershop.create({
      user_id: assignedUserId,
      name,
      address,
      city,
    });

    // 🔁 Traer con datos del dueño
    const barbershopWithOwner = await Barbershop.findByPk(newBarbershop.id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
    });

    res.status(201).json({
      message: "Barbería creada con éxito",
      data: barbershopWithOwner,
    });
  } catch (error) {
    console.error("❌ Error al crear barbería:", error);
    res.status(500).json({ error: "Error al crear la barbería" });
  }
};

/* ============================================================
   📍 Obtener todas las barberías (filtradas según rol)
============================================================ */
exports.getAllBarbershops = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

    // 👑 ADMIN → ve todas
    if (user.role_id === 1) {
      where = {};
    }
    // 👤 DUEÑO → solo sus barberías
    else if (user.role_id === 2) {
      where = { user_id: user.id };
    }
    // 👥 CLIENTE → solo barberías activas
    else if (user.role_id === 3) {
      where = { is_active: true };
    }

    const barbershops = await Barbershop.findAll({
      where,
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);
  } catch (error) {
    console.error("❌ Error al obtener barberías:", error);
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

/* ============================================================
   📍 Obtener barbería por ID
============================================================ */
exports.getBarbershopById = async (req, res) => {
  try {
    const { id } = req.params;
    const barbershop = await Barbershop.findByPk(id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
    });

    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    res.json(barbershop);
  } catch (error) {
    console.error("❌ Error al obtener la barbería:", error);
    res.status(500).json({ error: "Error al obtener la barbería" });
  }
};

/* ============================================================
   ✏️ Actualizar barbería (admin o dueño)
============================================================ */
exports.updateBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, user_id } = req.body;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    // 🔒 Permisos: admin o dueño propietario
    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permiso para modificar esta barbería" });
    }

    // 🧩 Si el admin cambia el dueño
    if (user.role_id === 1 && user_id) {
      const newOwner = await User.findByPk(user_id);
      if (!newOwner) {
        return res.status(404).json({ error: "El nuevo dueño no existe" });
      }
      if (newOwner.role_id !== 2) {
        return res.status(400).json({ error: "El nuevo dueño debe tener rol de dueño" });
      }
      barbershop.user_id = newOwner.id;
    }

    // 🔁 Actualizar campos
    await barbershop.update({
      name: name || barbershop.name,
      address: address || barbershop.address,
      city: city || barbershop.city,
      user_id: barbershop.user_id,
    });

    // 🔄 Devolver con datos del dueño actualizados
    const updated = await Barbershop.findByPk(id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
    });

    res.json({ message: "Barbería actualizada con éxito", data: updated });
  } catch (error) {
    console.error("❌ Error al actualizar la barbería:", error);
    res.status(500).json({ error: "Error al actualizar la barbería" });
  }
};

/* ============================================================
   🗑️ Eliminar barbería (solo admin)
============================================================ */
exports.deleteBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role_id !== 1) {
      return res.status(403).json({ error: "Solo los administradores pueden eliminar barberías" });
    }

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    await barbershop.destroy();

    res.json({ message: "Barbería eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar barbería:", error);
    res.status(500).json({ error: "Error al eliminar la barbería" });
  }
};
