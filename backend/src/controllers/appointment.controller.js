const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Barbershop = require('../models/Barbershop');
const User = require('../models/User');

// Crear cita
exports.createAppointment = async (req, res) => {
  try {
    const { user_id, barbershop_id, service_id, date, time, notes } = req.body;

    const appointment = await Appointment.create({
      user_id,
      barbershop_id,
      service_id,
      date,
      time,
      notes
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    res.status(500).json({ error: 'Error al crear cita' });
  }
};

// Listar citas (admin o dueño)
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
        { model: Barbershop, as: 'barbershop', attributes: ['id', 'name'] }
      ],
      order: [['date', 'ASC']],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

// Actualizar estado (confirmar, cancelar, completar)
exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });

    const { status } = req.body;
    await appointment.update({ status });
    res.json({ message: 'Estado actualizado correctamente', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
};

// Eliminar cita
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });

    await appointment.destroy();
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};
