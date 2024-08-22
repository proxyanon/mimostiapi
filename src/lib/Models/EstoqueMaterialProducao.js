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
        allowNull : true
    },
    entrada : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    saida : {
        type : Sequelize.INTEGER,
        allowNull : true
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;