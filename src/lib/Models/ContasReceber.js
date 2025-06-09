const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('contas_receber', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    cliente_id : {
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
    valor_pago : {
        type : Sequelize.FLOAT,
        allowNull : true,
        defaultValue : 0
    },
    pago : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : 'Não pago'
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;