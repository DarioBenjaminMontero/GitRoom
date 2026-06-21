const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const clases = sequelize.define('clases', {
    id_clase: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    personas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    es_profesor: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    }

}, {
    tableName: 'clases',
    timestamps: false
});
module.exports = { clases };