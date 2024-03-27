const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('funcionarios', {
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
    cpf : {
        type : Sequelize.STRING,
        allowNull : false
    },
    telefone : { 
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
    whatsapp : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    funcao : { 
        type : Sequelize.STRING,
        allowNull : true
    },
    datecreated : {
        type : Sequelize.DATE,
        allowNull : true
    }
})

module.exports = Model;