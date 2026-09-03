const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Archivos = sequelize.define('Archivos', {
    id_archivo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ruta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_repo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:
        {
            model: 'repositorios',
            key: 'id_repo'
        }
    },

}, {
    tableName: 'Archivos',
    timestamps: false
});

module.exports = { Archivos };