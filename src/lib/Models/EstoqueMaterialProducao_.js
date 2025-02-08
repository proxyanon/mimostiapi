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
const now_date = new Date();

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
        references: {
            model: 'EstoqueMaterialProducao',
            key: 'id',
        },
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

module.exports = Model;