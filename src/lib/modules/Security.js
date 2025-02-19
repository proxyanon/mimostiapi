const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { sanitize } = require('express-xss-sanitizer');
const path = require('path');
const fs = require('fs');

class Security {

    constructor(){

        this.middlewares.generate_csrf = this.middlewares.generate_csrf.bind(this);
        this.middlewares.csrf_check = this.middlewares.csrf_check.bind(this);
        this.middlewares.auth_check = this.middlewares.auth_check.bind(this);
        this.middlewares.redirect_singned = this.middlewares.redirect_singned.bind(this);
        this.middlewares.sanitize_body = this.middlewares.sanitize_body.bind(this)

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

    static checkFields(fields = undefined){
        let hasFields = fields !== undefined && typeof fields == 'object' ? true : false;
        return hasFields;
    }

    static checkBody(body, fields){

        //return true;

        if(typeof body != 'object' || typeof fields != 'object'){
            return false;
        }

        let bodyKeys = Object.keys(body);
        let fieldsKeys = Object.keys(fields);
        
        if(fieldsKeys.includes('id')){
            let fieldIdIndex = fieldsKeys.indexOf('id');
            fieldsKeys.splice(fieldIdIndex, 1);
        }

        console.log('fields', fieldsKeys, fieldsKeys.length);
        console.log('body', bodyKeys, bodyKeys.length);

        if(fieldsKeys.length != bodyKeys.length){
            return false;
        }

        return true;

    }

    static checkCPF_CNPJ(cpf_cnpj){
        
        if(!cpf_cnpj) return false;

        if(cpf_cnpj.length < 14 || cpf_cnpj.length > 18){
            return false
        }

        return true

    }

    static logInfo(content, error = false){
        if(!error){
            config.verbose || config.isDev ? console.log(content) : '';
        }else{
            config.verbose || config.isDev ? console.error(content) : '';
        }
    }

    logInfoIntoFile(log_data = ''){

        if(!log_data || log_data == '' || log_data == null || log_data == undefined || log_data == 0){
            Security.logInfo('Log data cannot be empty', true);
            return;
        }

        let log_filename = config.logs.filename;
        let log_path = path.join(__dirname, '..', '..', 'logs', log_filename)

        try{
            if(fs.existsSync(log_path)){
                fs.appendFileSync(log_path, log_data)
            }else{
                fs.writeSync(log_path, log_data);
            }
            Security.logInfo('Loging data...')
        }catch(err){
            Security.logInfo(`[LOG ERROR] ${err}`, true);
        }

    }

    /**
     * 
     * @param {any} module_field
     * @param {String} key
     * @returns {Boolean}
     */
    static checkIntFloat(module_field, key){

        if(module_field[key].type == 'INTEGER'){
            return parseInt(module_field[key]) == NaN || parseInt(field_value) < 0;
        }else if(module_field[key].type == 'FLOAT'){
            return parseFloat(module_field[key]) == NaN || parseFloat(module_field[key]) < 0;
        }

        return false;

    }

    responses = {

        unauthorized : (res, msg) => {
            return res.status(401).json({ error : true, msg })
        },

        setResponses : async (req, res, next) => {
            
            res.notAccept = function(msg, fields = undefined){
                
                if(Security.checkFields(fields)){
                    return res.status(403).json({ error : true, msg, fields : Object.keys(fields) });
                }else{
                    return res.status(403).json({ error : true, msg });
                }

            }

            res.badRequest = function(msg, fields = undefined){
                
                if(Security.checkFields(fields)){
                    return res.status(400).json({ error : true, msg, fields : Object.keys(fields) });
                }else{
                    return res.status(400).json({ error : false, msg });
                }

            }

            res.serverError = function(msg, fields = undefined){
                
                if(Security.checkFields(fields)){
                    return res.status(500).json({ error : true, msg, fields : Object.keys(fields) });
                }else{
                    return res.status(500).json({ error : true, msg });
                }

            }

            res.block = function(msg, fields = undefined){
                
                if(Security.checkFields(fields)){
                    return res.status(401).json({ error : true, msg, fields : Object.keys(fields) });
                }else{
                    return res.status(401).json({ error : true, msg });
                }

            }

            res.success = function(data = undefined, fields = undefined){

                let checkData = data != undefined && typeof data == 'object' && Object.values(data).length > 0 ? true : false;
                let hasFields = Security.checkFields(fields);

                if(checkData && hasFields){
                    return res.json({ error : false, results : data, fields : Object.keys(module.fields) })
                }else if(hasFields){
                    return res.json({ error : false, fields : Object.keys(fields) })
                }else{
                    return res.json({ error : false })
                }

            }

            res.notFound = function(msg, fields = undefined) {
                
                if(Security.checkFields(fields)){
                    return res.status(404).json({ error : true, msg, fields : Object.keys(fields) });
                }else{
                    return res.status(404).json({ error : true, msg });
                }
            
            }

            res.sendData = async function(results, fields = undefined){

                if(Security.checkFields(fields)){
                    return res.status(200).json({ error : false, results, fields : Object.keys(fields) });
                }else{
                    return res.status(200).json({ error : false, results });
                }

            }

            res.sendOkResponse = async function(fields = undefined){
                
                if(Security.checkFields(fields)){
                    return res.status(200).json({ error : false, fields : Object.keys(fields) });
                }else{
                    return res.status(200).json({ error : false });
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
                return res.redirect('/');
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

                    config.isDev || config.verbose ? console.log(req.headers[config.tokens.csrf.header], req.session.csrf_token) : null;

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

        },

        // sanitize requests bodys
        // check if has id in DELETE method
        sanitize_body : async (req, res, next) => {

            if((req.method == 'POST' || req.method == 'PUT') && req.body){
                
                if(!Object.keys(req.body).length){
                    return res.status(400).json({ error : true, msg : '[Security.js] Body cannot be empty' })
                }

                config.isDev || config.verbose ? console.log(req.params) : null;

                if(req.method == 'PUT' && !req.params.id){
                    console.log(req.method)
                    console.log(req.params)
                    return res.status(400).json({ error : true, msg : '[Security.js] You have to specify ID to save' })
                }

                req.body = sanitize(req.body);

                next();

            }else{

                if(req.method == 'DELETE' && !req.params.id){
                    return res.status(400).json({ error : true, msg : '[Security.js] Specify ID' });
                }

                req.params.id = parseInt(req.params.id);

                config.isDev || config.verbose ? console.log(req.params.id, req.params) : null

                if(parseInt(req.params.id) == NaN){
                    return res.status(400).json({ error : true, msg : '[Security.js] Specify ID' });
                }

                next();
            }

        },

        upload_file : async (req, res, next) => {

            let sampleFile;
            let uploadPath;
            let accepted_ext = config.uploads.accepted_ext;
            let accepted_mime_types = config.uploads.accepted_mime_types;

            /*req.toArray()
                .then(r => {
                    console.log('req.toArray', r)
                })
                .catch(err => {
                    config.isDev && config.verbose ? console.error(err) : '';
                })*/

            if(!Object.keys(req).includes('files')){
                return res.status(403).json({ error : true, msg : 'Nenhum arquivo foi carregado' });
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(403).json({ error : true, msg : 'Nenhum arquivo foi carregado' });
            }

            /*if(!Object.keys(req.files).includes('foto') || !req.files.foto){
                return res.status(403).json({ error : true, msg : 'O campo foto precisa ser preenchido' });
            }*/

            sampleFile = req.files['foto'];
            uploadPath = path.join(config.uploads.upload_path, `${Security.makeid(10)}.png`);

            if(accepted_ext.includes(path.extname(sampleFile.name)) && accepted_mime_types.includes(sampleFile.mimetype)){

                //console.log(sampleFile, uploadPath);

                // Use the mv() method to place the file somewhere on your server
                sampleFile.mv(uploadPath, function(err) {
                    if (err){
                        return res.status(500).json({ error : true, msg : err.toString() });
                    }
                    req.body.foto = path.basename(uploadPath);
                    next();
                });

            }else{
                return res.status(401).json({ error : true, msg : 'Tipo de arquivo inválido apenas arquivos de imagens serão aceitos (.png,.jpg,.jpeg,.gif)' });
            }
        
        }

    }

}

module.exports = Security;