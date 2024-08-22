const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('usuarios', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    usuario : {
        type : Sequelize.STRING,
        allowNull : false
    },
    senha : {
        type : Sequelize.STRING,
        allowNull : false
    },
    ativo : { 
        type : Sequelize.INTEGER,
        allowNull : true,
        defaultValue : 1
    }
})

module.exports = Model;