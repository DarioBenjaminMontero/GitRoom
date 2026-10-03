const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Mensajes = sequelize.define('Mensajes', {
    id_mensaje:
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        autoIncrement: true,
        primaryKey: true
    },
    id_chat:
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        references:
        {
            model: 'chats',
            key: 'id_chat'
        }
    },
    id_emisor:
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        references:
        {
            model: 'usuarios',
        key: 'id_usuario'
        }
    },
    mensaje:
    {
        type: DataTypes.TEXT,
        allowNULL: false,
    },
    horario_de_publicacion:
    {
        type: DataTypes.DATE,
        allowNULL: false
    }
}, {
    tableName: 'mensajes',
    timestamps: false
});

module.exports= {Mensajes}