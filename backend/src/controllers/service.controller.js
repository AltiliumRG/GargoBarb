// backend/src/controllers/service.controller.js
const Service = require('../models/Service');
const Barbershop = require('../models/Barbershop');

// Crear servicio
exports.createService = async (req, res) => {
  try {
    const { barbershop_id, name, description, price, duration_minutes } = req.body;

    // Validar barbería
    const barbershop = await Barbershop.findByPk(barbershop_id);
    if (!barbershop) {
      return res.status(404).json({ error: 'Barbería no encontrada' });
    }

    const service = await Service.create({
      barbershop_id,
      name,
      description,
      price,
      duration_minutes,
      is_active: true
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

// Obtener todos los servicios
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{ model: Barbershop, as: 'barbershop', attributes: ['id', 'name', 'city'] }]
    });
    res.json(services);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

// Obtener un servicio por ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: Barbershop, as: 'barbershop', attributes: ['id', 'name', 'city'] }]
    });

    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.json(service);
  } catch (error) {
    console.error('❌ Error al obtener servicio:', error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
};

// Actualizar servicio
exports.updateService = async (req, res) => {
  try {
    const { name, description, price, duration_minutes, is_active } = req.body;
    const service = await Service.findByPk(req.params.id);

    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });

    await service.update({ name, description, price, duration_minutes, is_active });

    res.json({ message: 'Servicio actualizado correctamente', service });
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

// Eliminar servicio
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });

    await service.destroy();
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};
