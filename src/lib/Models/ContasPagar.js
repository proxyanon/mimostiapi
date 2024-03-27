const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('contas_pagar', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    fornecedor_id : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    valor : {
        type : Sequelize.FLOAT,
        allowNull : false
    },
    forma_pagamento : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    desconto : {
        type : Sequelize.FLOAT,
        allowNull : true
    },
    descricao : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;