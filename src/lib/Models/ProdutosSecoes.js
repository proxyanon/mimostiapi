const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('produtos_secoes', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    nome : {
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = Model;