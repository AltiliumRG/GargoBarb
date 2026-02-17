const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
const Service = require('./Service');
const Barbershop = require('./Barbershop');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  barbershop_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'barbershops',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  service_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  barber_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    defaultValue: 'pendiente',
  },
  notes: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
});

// Relaciones
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Appointment.belongsTo(User, { foreignKey: 'barber_id', as: 'barber' });
Appointment.belongsTo(Barbershop, { foreignKey: 'barbershop_id', as: 'barbershop' });
Appointment.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = Appointment;
