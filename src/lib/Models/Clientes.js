const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('clientes', {
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
    cpf_cnpj : {
        type : Sequelize.STRING,
        allowNull : true
    },
    endereco : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    ponto_referencia : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    telefone : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    whatsapp : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    instagram : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : true
    }
})

module.exports = Model;