/**
 * 
 * @author Daniel Victor Freire
 * @version 2.1.2
 * @description Modelo da tabela de estoque de material de produção
 * @file EstoqueMaterialProducao.js
 * @copyright Mimos tia Pi 2025
 * @package mimostiapi
 */

/**
 * @constant {class} {Sequelize}
 * @constant {object} {db}
 * @constant {object} {now_date}
 */
const Sequelize = require('sequelize');
const db = require('../modules/database');
const now_date = new Date();

/**
 * 
 * @constant {object} {Model}
 */
const Model = db.define('estoque_material_producao', {
    /**
     * @property {INTEGER} {id} {autoIncrement : true, allowNull : false, primaryKey : true}
     * @property {STRING} {foto} {allowNull : true, defaultValue : 'defaultProduct.png'}
     * @property {STRING} {especificacao} {allowNull : false}
     * @property {INTEGER} {cor} {allowNull : false}
     * @property {STRING} {marca} {allowNull : true}
     * @property {INT} {unidade} {allowNull : false}
     * @property {FLOAT} {entrada} {allowNull : false}
     * @property {FLOAT} {saida} {allowNull : true, defaultValue: 0.0}
     * @property {DATE} {datecreated} {allowNull : false, defaultValue : now_date}
     */
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
        type : Sequelize.INT,
        allowNull : false
    },
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
        defaultValue : now_date
    }
})

/**
 *
 * @constant {Model} {module.exports}
 */
module.exports = Model;