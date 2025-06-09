const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    dialect: 'mysql',
    host: config.mysql.host,
    define : {
        timestamps : false,
        freezeTableName : true
    }
});

module.exports = sequelize;