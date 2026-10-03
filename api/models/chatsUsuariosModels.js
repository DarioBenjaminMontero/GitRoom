const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const chatsUsuarios = sequelize.define('chatsUsuarios', {
    id_chat: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        
    },

}, {
    tableName: 'chatsUsuarios',
    timestamps: false
});
module.exports = { chatsUsuarios };