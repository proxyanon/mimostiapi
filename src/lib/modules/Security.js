const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Security {

    constructor(){

        this.middlewares.generate_csrf = this.middlewares.generate_csrf.bind(this);
        this.middlewares.csrf_check = this.middlewares.csrf_check.bind(this);
        this.middlewares.auth_check = this.middlewares.auth_check.bind(this);
        this.middlewares.redirect_singned = this.middlewares.redirect_singned.bind(this);

        this.responses.unauthorized = this.responses.unauthorized.bind(this);
        this.responses.setResponses = this.responses.setResponses.bind(this);

        this.level_routes = config.server.level_routes;
        this.routes_names = Object.values(this.level_routes.map(route => { return route.name }))

        this.tokens.random = this.tokens.random.bind(this);

        this.JWT_SECRET = config.tokens.jwt.secret;

    }

    static makeid(length) {

        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
    
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random()*charactersLength));
        }

        return result;
    }

    static generatebarcode(length) {

        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
    
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random()*charactersLength));
        }

        return result;
    }

    static handleParams(req, res, next){

        let error = null;

        try{
            decodeURIComponent(req.path);
        }catch(err){
            error = err;
        }

        if(error){
            return res.status(500).json({ error : true, msg : 'Ocorreu um erro' });
        }

        next()
        
    }

    responses = {

        unauthorized : (res, msg) => {
            return res.status(401).json({ error : true, msg })
        },

        setResponses : async (req, res, next) => {
            
            res.notAccept = function(msg){
                return res.status(403).json({ error : true, msg });
            }

            res.serverError = function(msg){
                return res.status(500).json({ error : true, msg });
            }

            res.block = function(msg){
                return res.status(401).error({ error : true, msg });
            }

            res.success = function(data){

                const checkData = (data !== undefined && typeof data == 'object' && Object.values(data).length > 0);

                if(checkData) {
                    return res.json({ error : false, data });
                }else{
                    return res.status().json({ error : false });
                }
            }

            next();
        }

    }

    tokens = {

        auth : () => {
            return jwt.sign({ data : 'foobar' }, config.tokens.jwt.secret, { expiresIn : '1d' })
        },

        random : (size) => {
            return randomBytes(size).toString('base64').slice(0,size).toUpperCase();
        }

    }

    middlewares = {

        redirect_singned  : async (req, res, next) => {

            if(req.session.isAuthenticated && req.session.token){
                return res.redirect('/app');
            }else{
                return res.redirect('/teste');
            }

        },

        generate_csrf : async (req, res, next) => {

            if(config.tokens.csrf.required){

                if(req.session.csrf_token === undefined){
                    req.session.csrf_token = randomBytes(config.tokens.csrf.size).toString('base64');
                }

            }

            next();

        },

        csrf_check : async (req, res, next) => {

            if(config.tokens.csrf.required){

                if(!req.headers[config.tokens.csrf.header] || !req.session.csrf_token){
                    return this.responses.unauthorized(res, 'Não autorizado (CSRF)');
                }else{

                    console.log(req.headers[config.tokens.csrf.header], req.session.csrf_token);

                    if(req.headers[config.tokens.csrf.header] != req.session.csrf_token){
                        return this.responses.unauthorized(res, 'Não autorizado (CSRF 2)');
                    }else{
                        next();
                    }

                }

            }else{
                next();
            }

        },

        // verifica se o usuario esta autenticado
        // isAuthenticated, token, level campos requeridos para validacao
        // checar a validade do token JWT
        // sistema de leveis de login
        auth_check : async (req, res, next) => {

            const isApi = req.baseUrl.indexOf('/api/') !== -1;

            console.log(req.session)

            if(req.session.isAuthenticated && req.session.token){

                let check_token = await jwt.verify(req.session.token, this.JWT_SECRET);

                if(!check_token){
                    if(isApi){
                        return this.responses.unauthorized(res, 'Não autorizado ou autenticado faça login novamente');
                    }else{
                        return res.redirect('/app');
                    }
                }else {
                    next();
                }

            }else{
                if(isApi){
                    return this.responses.unauthorized(res, 'Não autorizado (EMPTY)');
                }else{
                    return res.redirect('/');
                }
            }

        }

    }

}

module.exports = Security;