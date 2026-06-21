const { sequelize } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const Chats =  sequelize.define("Chats",{
    id_chat:
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        autoIncrement: true,
        primaryKey: true
    },
    es_privado:
    {
        type: DataTypes.BOOLEAN,
        allowNULL: false,
        defaultValue: true
    },
    id_usuario: 
    {
        type: DataTypes.INTEGER,
        allowNULL: false,
        references:
        {
            model: "usuarios",
            key: "id_usuario"
        }
    }
},{
    tableName: "chats",
    timestamps:  false
});
module.exports = { Chats };