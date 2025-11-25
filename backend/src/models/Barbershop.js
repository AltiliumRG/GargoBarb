// backend/src/models/Barbershop.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Barbershop = sequelize.define('Barbershop', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'barbershops',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Relaciones
User.hasMany(Barbershop, { foreignKey: 'user_id', as: 'barbershops' });
Barbershop.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

module.exports = Barbershop;
