
/**
 * @requires express
 * @const {express.Router} router
 */
const express = require('express');
const router = express.Router();

/**
 * @typedef {Object} Module
 * @property {Function} test - Handles the test route.
 * @returns {express.Router} The configured router.
 */
module.exports = () => {

    /**
     * @var {Object} module
     */
    var module = {}

    module.get_args = function (func, args){
        return Array.prototype.slice.call(args, func.length);
    }

    /**
     * @async
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {Function} next 
     * @returns {Promise<express.Response>}
     */ 
    module.test = async function(req, res, next) {
        try{
            return res.json({ error : false, args : module.get_args(module.test, arguments)});
        }catch(err){
            return res.json({ error : true, msg : `Error ${err}` });
        }
    }

    router
        .get('/:id?', module.test)

    return router

}