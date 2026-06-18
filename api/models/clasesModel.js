const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Clases = sequelize.define ('Clases',{
    id_clase :{
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    Personas : {
        
    }
})