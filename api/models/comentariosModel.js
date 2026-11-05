const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');
const Comentarios = sequelize.define('Comentarios', {
    id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,


    },
    id_anuncio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'anuncios',
            key: 'id_anuncio'
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_comentario: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "comentarios",
    timestamps: false
})

module.exports = { Comentarios }

