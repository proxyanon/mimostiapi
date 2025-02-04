/**
 * 
 * @author Daniel Victor Freire
 * @version 2.1.2
 * @description Modelo da tabela de tipo de unidade
 * @file TipoUnidades.js
 * @copyright Mimos tia Pi 2025
 * @package mimostiapi
 */

/**
 * 
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
     * 
     * @property {INTEGER} {id} {autoIncrement : true, allowNull : false, primaryKey : true}
     * @property {STRING} {nome} {allowNull : false}
     * @property {DATE} {datecreated} {allowNull : false, defaultValue : now_date}
     */
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    nome : {
        type : Sequelize.STRING,
        allowNull : false,
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