const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Clases = sequelize.define ('Clases',{
    id_clase :{
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    Personas : {
        type : DataTypes.STRING,
        allowNull : false
    },
    es_Profesor : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    },
    id_Usuario : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
});
module.exports = {Clases};