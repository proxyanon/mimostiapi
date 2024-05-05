const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

const { xss, sanitize } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.Clientes.rawAttributes

    module.searchClientes = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado') };

        const { search } = req.params;
            
        const results = await models.Clientes.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getClientes = async (req, res, next) => {

        let results = req.params.id ? await models.Clientes.findByPk(req.params.id) : await models.Clientes.findAll();

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addCliente = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        for(key in module.fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : `Campos inválido(s) 2 [${key}]` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.Clientes.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar cliente' })
            }

        }

    }

    module.saveCliente = async (req, res, next) => {

        const cliente = await models.Clientes.findByPk(req.params.id);

        if(cliente){
            
            cliente['datecreated'] = new Date();

            req.body = sanitize(req.body);

            for(key in module.fields){
                console.log(key, cliente[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && cliente[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        cliente[key] = req.body[key]
                    }
                }
            }

            const results = await cliente.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o cliente' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Cliente não encontrado' })
        }

    }

    module.deleteCliente = async (req, res, next) => {

        const cliente = await models.Clientes.findByPk(req.params.id);

        if(cliente){

            const results = await cliente.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', sec.middlewares.csrf_check, module.searchClientes)
        .get('/:id?', sec.middlewares.csrf_check, module.getClientes)
        .post('/add', xss(), sec.middlewares.csrf_check, module.addCliente)
        .put('/save/:id', xss(), sec.middlewares.csrf_check, module.saveCliente)
        .delete('/del/:id', sec.middlewares.csrf_check, module.deleteCliente);

    return router;

}