const config = require('../config');
const { Sequelize } = require('sequelize');

let sequelize = null;

try{
    
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
        dialect: 'mysql',
        host: config.mysql.host,
        define : {
            timestamps : false,
            freezeTableName : true
        }
    });

}catch(Exception as e){
    if(config.)
    throw Exception(`[Erro ao conectar na base de dados src/modules/db.js]: ${e.toString()}`)
}

module.exports = sequelize;