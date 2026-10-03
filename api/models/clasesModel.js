const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const clases = sequelize.define('clases', {
    id_clase: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombreClase: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
        
    }

}, {
    tableName: 'clases',
    timestamps: false
});
module.exports = { clases };