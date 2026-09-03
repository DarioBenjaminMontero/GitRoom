const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const chatsUsuarios = sequelize.define('chatsUsuarios', {
    id_chat: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references: {
      model: 'chats',
      key: 'id_chat'
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

}, {
    tableName: 'chatsUsuarios',
    timestamps: false
});
module.exports = { chatsUsuarios };