const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const ArchivosAnuncio = sequelize.define('archivosAnuncio', {
    id_Archivo_Anuncio :{
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    id_Anuncio:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references :{
            model: 'anuncios',
            key: 'id_anuncio'
        }

    },

    tipo: {
        type: DataTypes.ENUM('anuncio', 'tarea', 'prueba','cuestonario','foro'),
        allowNull: false
    },


    url_archivo :{
type: DataTypes.STRING,
allowNull : false
    }

},
    {tableName: 'archivosAnuncio',
    timestamps: false


});

module.exports = {ArchivosAnuncio};