const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('GitRoom', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false 
});

module.exports = sequelize;