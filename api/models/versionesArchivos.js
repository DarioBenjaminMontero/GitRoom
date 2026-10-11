const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const versionesArchivos = sequelize.define('versionesArchivos', {
    id_version: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_commit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:
        {
            model: 'commits',
            key: 'id_commit'
        }
    },
    id_archivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:
        {
            model: 'Archivos',
            key: 'id_archivo'
        }
    },
    tipo:
    {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    ruta_fisica:
    {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    tableName: 'version_Archivos',
    timestamps: false
});

module.exports = { versionesArchivos };