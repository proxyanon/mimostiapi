/**
 * 
 * @author Daniel Victor Freire
 * @version 2.1.2
 * @description Modelo da tabela de estoque de material de produção
 * @file EstoqueMaterialProducao.js
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