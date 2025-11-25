// ✅ backend/src/models/Service.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Barbershop = require('./Barbershop');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  barbershop_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: Barbershop,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'services',
  timestamps: true,
  underscored: true
});

// 🔗 Relaciones
Barbershop.hasMany(Service, { foreignKey: 'barbershop_id' });
Service.belongsTo(Barbershop, { foreignKey: 'barbershop_id' });

module.exports = Service;
