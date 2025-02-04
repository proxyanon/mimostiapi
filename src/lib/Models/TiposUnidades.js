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
 */
const Sequelize = require('sequelize');
/**
 * 
 * @constant {class} {db}
 */
const db = require('../modules/database');

/**
 * 
 * @constant {method} {Model}
 */
const Model = db.define('estoque_material_producao', {
    /**
     * @property {INTEGER} {id} {autoIncrement : true, allowNull : false, primaryKey : true}
     */
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    /**
     * @property {STRING} {nome} {allowNull : false}
     */
    nome : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    /**
     * @property {DATE} {datecreated} {allowNull : false, defaultValue : new Date()}
     */
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