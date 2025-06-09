const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('estoque_produto_final', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    produto : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    especificacao : {
        type : Sequelize.STRING,
        allowNull : false
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