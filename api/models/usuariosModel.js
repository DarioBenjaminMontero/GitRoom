const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const usuarios = sequelize.define('usuarios', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    año_division:{
        type:DataTypes.STRING(8),
        allowNull:false
    }

}, {
    tableName: 'usuarios',
    timestamps: false
});
module.exports = { usuarios };