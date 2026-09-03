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
            model: 'archivos',
            key: 'id_archivo'
        }
    },
    conteido_Texto:
    {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    tableName: 'version_Archivos',
    timestamps: false
});

module.exports = { versionesArchivos };