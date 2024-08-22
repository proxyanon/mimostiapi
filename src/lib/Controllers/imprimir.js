const express = require('express');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.imprimirPedidos = async (req, res, next) => {
        
    }

    router
        .use(sec.middlewares.csrf_check)
        .use(sec.middlewares.auth_check)
        .get('/pedidos', )

    return module;
}