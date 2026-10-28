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
    // 🍪 Solo lo usan los grupos, en los privados queda en null
    nombre:
    {
        type: DataTypes.STRING(150),
        allowNull: true
    },
},{
    tableName: "chats",
    timestamps:  false
});
module.exports = { Chats };