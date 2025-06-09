const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('produtos_categorias', {
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
    secao : {
        type : Sequelize.INTEGER,
        allowNull : false,
    }
})

module.exports = Model;