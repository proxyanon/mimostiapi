/**
 * @author Daniel Freire
 * @version 2.1.7 - 2025
 * @date 2023-04-02
 * @since 2021-05-20
 * @copyright Mimos Tia Pia 2025
 * @git github.com/proxyanon/mimostiapi
 * @branch {master:main}
 * @package C:/Users/daniel/desktop/git/src/lib/Controllers/estoque_material_producao
 * @description Controlador de estoque de material de produção
 * @see {@link module:estoque_material_producao}
 * @type {Function}
 */

/**
 * @requires {express}
 * @requires {../modules/models}
 * @requires {bcrypt}
 * @requires {../module/Security}
 * @requires {../config}
 * @typedef {Security} - Criando type hint do tipo Security
 * @const Security {sec} - Instância da lib Security.js
 * @const express.Router {router} - Cria o router para criação de endpoints
 * @const Function {xss, sanitize} - Funções para camada de sec
 * 
 * */
const express = require('express');
const models = require('../modules/models');
const bcrypt = require('bcrypt');

const Security = require('../modules/Security');
const config = require('../config');

const sec = new Security();
const router = express.Router();

const { xss, sanitize } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.Usuarios.rawAttributes

    module.getUsers = async (req, res, next) => {

        let results = req.params.id ? await models.Usuarios.findByPk(req.params.id) : await models.Usuarios.findAll();

        if(results){
            res.json({ error : false, results })
        }else{
            res.status(500).json({ error : true, msg : 'Nada encontrado' })
        }

    }

    module.addUser = async (req, res, next) => {

        let obj_create = {}

        req.body.ativo = 1;

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.Usuarios.tableName.toUpperCase()}] Formulário não aceito`);
        }

        for(let key in module.fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : 'Campos inválido(s)' })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        obj_create['senha'] = await bcrypt.hash(obj_create['senha'], 10)

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s)' })
        }else{

            const results = await models.Usuarios.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar usuário' })
            }

        }

    }

    module.saveUser = async (req, res, next) => {

        const usuario = models.Usuarios.findByPk(req.params.id)
        
        if(usuario){
            
            for(let key in module.fields){
                if(key != 'id' && req.body[key]){
                    usuario[key] = req.body[key]
                }
            }

            const results = await usuario.save()

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : '' })
            }

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao salvar o usuário' })
        }


    }

    module.deleteUser = async (req, res, next) => {

        const usuario = models.Usuarios.findByPk(req.params.id)

        if(usuario){

            usuario.destroy();
            res.json({ error : false })

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar o usuário' })
        }

    }

    module.login = async (req, res, next) => {

        if(req.body.usuario && req.body.senha){
            
            const { usuario, senha } = req.body

            const results = await models.Usuarios.findAll({ where : { usuario }})
            
            let check = false;
            let sess_id = false;
            let sess_username = false;

            if(results){

                for(let key in results){
                    try{
                    
                        check = await bcrypt.compare(senha, results[key].senha);

                        console.log(check, senha, results[key].senha);
                    
                        sess_id = check ? results[key].id : false;
                        sess_username = check ? results[key].usuario : false;
                    
                    }catch(err){
                        check = false;
                        console.error(err)
                    }
                }

                if(check){
                    
                    let sess_token = sec.tokens.auth();

                    req.session.isAuthenticated = true;
                    req.session.session_username = sess_username;
                    req.session.session_id = sess_id;
                    req.session.token = sess_token;

                    res.json({ error : false, redirect : '/app' });

                }else{
                    res.block('Login e senha inválidos');
                }

            }else{
                return res.status(404).json({ error : true, msg : 'Usuário não encontrado' })
            }

        }else{
            return res.status(500).json({ error : true, msg : 'Campo(s) inválido(s)' });
        }

    }

    module.logout = async (req, res, next) => {
        
        if(req.session.isAuthenticated) {

            req.session.destroy(err => {
                err ? console.error(`Error when logout ${err}`) : res.redirect('/');
            });

            /*try{
                delete req.session.isAuthenticated;
                delete req.session.session_id;
                delete req.session.token;
            }catch(err){
                console.warn(err.message);
            }*/
        }else{
            res.redirect('/')
        }

    }

    router
        .use(sec.responses.setResponses)
        .post('/login', module.login)
        .get('/logout', sec.middlewares.auth_check, module.logout)
        .get('/:id?', sec.middlewares.auth_check, module.getUsers)
        .post('/add', sec.middlewares.auth_check, module.addUser)
        .put('/save/:id', sec.middlewares.auth_check, module.saveUser)
        //.delete('/del/:id', sec.middlewares.csrf_check, sec.middlewares.auth_check, module.deleteUser)

    return router;

}