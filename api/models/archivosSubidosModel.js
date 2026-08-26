const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Archivos = sequelize.define('Archivos', {
    id_Archivo :{
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    id_Anuncio:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references :{
            model: 'anuncios',
            key: id_anuncio
        }

    },

    fecha:{
        type: DataTypes.DATE,
        allowNull: false


    },

    nombre:{
        types: DataTypes.TEXT,
        allowNull:false

    },

    tipo: {
        type: DataTypes.ENUM('anuncio', 'tarea', 'prueba','cuestonario','foro'),
        allowNull: false
    },

},
    {tableName: 'archivos',
    timestamps: false


});

module.export = {Archivos};