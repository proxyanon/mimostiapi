const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('caixa_temp', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    caixa_id : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    produto_id : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    forma_pagamento_id : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    quantidade : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : false
    }
})

module.exports = Model;