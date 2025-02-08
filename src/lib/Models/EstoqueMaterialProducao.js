/**
 * @requires sequelize
 */
const Sequelize = require('sequelize');
/**
 * @constant {Object} db - O database para os modulos usado para interagir com o ORM Sequelize.
 * @requires ../modules/database
 */
const db = require('../modules/database');

/**
 * @constant {Date} now_data - A data atual.
 */
const now_data = new Date();

/**
 * Representa o modelo EstoqueMaterialProducao.
 * 
 * @typedef {Object} EstoqueMaterialProducao
 * @property {number} id - O identificador único para o estoque de produção de material.
 * @property {string} especificacao - A especificação do material.
 * @property {number} cor - O identificador da cor do material.
 * @property {number} unidade - O identificador da unidade do material.
 * @property {number} entrada - A quantidade de material que entrou.
 * @property {number} saida - A quantidade de material que saiu. O padrão é 0.
 * @property {Date} datecreated - A data em que o registro foi criado. O padrão é a data atual.
 */
const Model = db.define('estoque_materaial_producao', {
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
    unidade : { 
        type : Sequelize.INTEGER,
        allowNull : false
    },
    entrada : { 
        type : Sequelize.INTEGER,
        allowNull : false
    }
    ,
    saida : { 
        type : Sequelize.INTEGER,
        allowNull : true,
        defaultValue : 0
    }
    ,
    datecreated : { 
        type : Sequelize.DATE,
        allowNull : false,
        defaultValue : now_data
    }
})

/**
 * 
 * @module EstoqueMaterialProducao
 */
module.exports = Model;