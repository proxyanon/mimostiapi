const Sequelize = require('sequelize');
const db = require('../modules/database');

const Model = db.define('produtos', {
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
        allowNull : false
    },
    categoria : { 
        type : Sequelize.INTEGER,
        allowNull : false
    },
    preco : {
        type : Sequelize.FLOAT,
        allowNull : false
    },
    desconto : {
        type : Sequelize.FLOAT,
        allowNull : false,
        defaultValue : 0
    },
    cor : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    descricao : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : 'Nenhuma',
    },
    usuario : {type : Sequelize.STRING},
    codigo_barras : {type : Sequelize.STRING},
    datecreated : {
        type : Sequelize.DATE,
        allowNull : true
    }
})

module.exports = Model;