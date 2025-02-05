/**
 * 
 * @author Daniel Victor Freire
 * @version 2.1.2
 * @description Modelo da tabela de unidade
 * @file Unidades.js
 * @copyright Mimos tia Pi 2025
 * @package mimostiapi
 */

const Sequelize = require('sequelize');
const db = require('../modules/database');

/**
 * 
 * @constant {method} {Model}
 */
const Model = db.define('estoque_material_producao', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    foto : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : 'defaultProduct.png'
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
    unidade : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 1
    },
    entrada : {
        type : Sequelize.FLOAT,
        allowNull : false
    },
    saida : {
        type : Sequelize.FLOAT,
        allowNull : true,
        defaultValue: 0
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