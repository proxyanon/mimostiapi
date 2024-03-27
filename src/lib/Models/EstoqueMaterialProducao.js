const Sequelize = require('sequelize');
const db = require('../modules/database');

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
    unidade : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    entrada : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    saida : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;