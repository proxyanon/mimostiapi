const express = require('express');
const Security = require('../modules/Security');

/**
 * 
 * @constant {class<Security>} sec
 */
const sec = new Security();
/**
 * 
 * @param {express.Router} router
 */
const router = express.Router();

module.exports = () => {

    var module = {}

    module.index = async (req, res, next) => { // APP VIEW
        res.render('app', { csrf_token : req.session.csrf_token });
    }

    router
        .use(sec.middlewares.generate_csrf)
        .use(sec.middlewares.auth_check)
        //.use(sec.middlewares.redirect_singned)
        .get('/', module.index)

    return router

}