const express = require('express');
const models = require('../modules/models');
const bcrypt = require('bcrypt');


const Security = require('../modules/Security');
const config = require('../config');

const sec = new Security();
const router = express.Router();

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

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s)' })
        }

        req.body.ativo = 1;

        for(key in module.fields){
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
            
            for(key in module.fields){
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
                    res.status(401).json({ error : true, msg : 'Ocorreu um erro no login (CHECK)' })    
                }

            }else{
                res.status(401).json({ error : true, msg : 'Ocorreu um erro no login (404)' })
            }

        }else{
            res.status(500).json({ error : true, msg : 'Campo(s) inválido(s)' });
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
        .post('/login', module.login)
        .get('/logout', module.logout)
        .get('/:id?', module.getUsers)
        .post('/add', module.addUser)
        .put('/save/:id', module.saveUser)
        //.delete('/del/:id', sec.middlewares.csrf_check, sec.middlewares.auth_check, module.deleteUser)

    return router;

}