const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const UsuariosRepositorios = sequelize.define("UsuariosRepositorios", {
    id_usuario:
    {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
    },
    id_repo:
    {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
      model: 'repositorios',
      key: 'id_repo'
    }
    },
    rol_Colaborador:
    {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    tableName: 'UsuariosRepositorios',
    timestamps: false
})
module.exports = { UsuariosRepositorios }