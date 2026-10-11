const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Ajusta según tu archivo de conexión

const Entregas = sequelize.define('entregas', {
  id_entrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_anuncio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'anuncios',
      key: 'id_anuncio' 
    }
  },
  id_alumno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', 
      key: 'id_usuario' 
    }
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  calificacion: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'entregas',
  timestamps: false
});

module.exports = { Entregas };