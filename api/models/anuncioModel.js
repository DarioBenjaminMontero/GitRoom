const { sequelize } = require('../config/db.js'); // o el archivo donde se ponga la base de datos
const { DataTypes } = require('sequelize');

const Anuncios = sequelize.define('Anuncios', {
    id_anuncio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    id_clase: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clases',
            key: 'id_clase'
        }
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },

}, {
    tableName: 'anuncios',
    timestamps: false
});

module.exports = { Anuncios };