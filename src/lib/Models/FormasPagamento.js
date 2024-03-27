const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('formas_pagamentos', {
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
    datecreated : {
        type : Sequelize.DATE,
        allowNull : true
    }
})

module.exports = Model;