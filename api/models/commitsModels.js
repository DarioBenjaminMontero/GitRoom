const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');




const Commits = sequelize.define('commits',{


    id_commit : {  
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,


    },


    id_usuario : {
        type: DataTypes.INTEGER,
        allowNull : false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },


    id_repo :{
        type: DataTypes.INTEGER,
        allowNull : false,
        references: {
            model: 'repositorios',
            key: 'id_repo'
        }
    },


    id_commit_padre:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'commits',  
        key: 'id_commit',
        }
    }


   
},{


    tableName: "commits",
    timestamps:  false


})


module.exports = {Commits};
