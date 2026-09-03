const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const clasesUsuarios = sequelize.define('clasesUsuarios', {
    id_clase: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
      model: 'clases',
      key: 'id_clase'
    }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
       
    },
    esProfesor: {
        type: DataTypes.BOOLEAN,
        allowNull: false 
        
    }

}, {
    tableName: 'clasesUsuarios',
    timestamps: false
});
module.exports = { clasesUsuarios };