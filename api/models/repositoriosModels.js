const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const repositorios = sequelize.define('repositorios', {
    id_repo:
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion:
    {
        type: DataTypes.TEXT,
        allowNULL: false,
    },
    es_privado:
    {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    nombre_repo:
    {
        type: DataTypes.TEXT,
        allowNULL: false
    }, 
    fecha_creacion: {

type: DataTypes.DATE,
        allowNULL: false
    }
}, {
    tableName: 'repositorios',
    timestamps: false
});
module.exports = { repositorios };