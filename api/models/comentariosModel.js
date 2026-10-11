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
    texto: {
        type: DataTypes.STRING,
        
    }
}, {
    tableName: "comentarios",
    timestamps: false
})

module.exports = { Comentarios }

