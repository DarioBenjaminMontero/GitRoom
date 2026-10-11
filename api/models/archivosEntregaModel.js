const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ArchivosEntrega = sequelize.define('archivos_entrega', {
  id_archivo_entrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'entregas',   // Nombre de la tabla de entregas
      key: 'id_entrega'
    }
  },
  ruta_archivo: {
    type: DataTypes.STRING,
    allowNull: false
    // Aquí guardas la ruta física devuelta por Multer (ej: 'uploads/entregas/archivo.pdf')
  },
  tipo_contenido: {
    type: DataTypes.STRING,
    allowNull: true // Ej: 'application/pdf', 'image/png'
  }
}, {
  tableName: 'archivos_entrega',
  timestamps: false
});

module.exports = { ArchivosEntrega };