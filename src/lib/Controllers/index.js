const express = require('express');
const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

const models = require('../modules/models');

module.exports = () => {

    var module = {}

    module.index = async (req, res, next) => { // LOGIN VIEW

        console.log(models.CaixaTemp.tableName)

        if(req.session.isAuthenticated && req.session.token){
            return res.redirect('/app');
        }else{
            return res.render('login', { csrf_token : req.session.csrf_token });
        }
    }

    router
        .use(sec.middlewares.generate_csrf)
        .get('/', module.index)

    return router

}