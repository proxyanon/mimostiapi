const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('caixa', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    nome : {
        type : Sequelize.STRING,
        allowNull : false
    },
    descricao : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    entrada : { type : Sequelize.FLOAT, allowNull : true },
    saida : { type : Sequelize.FLOAT, allowNull : true },
    saldo : { type : Sequelize.FLOAT, allowNull : true },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;