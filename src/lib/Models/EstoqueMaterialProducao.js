const Sequelize = require('sequelize');
const db = require('../modules/database');

/**
 * 
 * @constant {db.define} {Model}
 */
const Model = db.define('estoque_material_producao', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    especificacao : {
        type : Sequelize.STRING,
        allowNull : false
    },
    cor : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    marca : {
        type : Sequelize.STRING,
        allowNull : true
    },
    foto : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : 'defaultProduct.png'
    },
    /*unidade : {
        type : Sequelize.INTEGER,
        allowNull : true
    },*/
    entrada : {
        type : Sequelize.FLOAT,
        allowNull : false
    },
    saida : {
        type : Sequelize.FLOAT,
        allowNull : true,
        defaultValue: 0.0
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false,
        defaultValue : new Date()
    }
})

/**
 *
 * @var {Model} {module1.exports}
 */
module.exports = Model;