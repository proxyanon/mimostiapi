const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

const { xss, sanitize } = require('express-xss-sanitizer');
const config = require('../config');

module.exports = () => {

    var module = {};

    module.fields = models.ContasPagar.rawAttributes

    module.searchContasPagar = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.ContasPagar.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getContasPagar = async (req, res, next) => {

        let results = null;

        if(req.params.id){

            results = await models.ContasPagar.findByPk(req.params.id, {
                include : [{
                    model : models.Fornecedores,
                    attributes : ['id', 'nome']
                }, {
                    model : models.FormasPagamentos,
                    attributes : ['id', 'nome']
                }]
            })

        }else{

            results = await models.ContasPagar.findAll({
                include : [{
                    model : models.Fornecedores,
                    attributes : ['id', 'nome']
                }, {
                    model : models.FormasPagamentos,
                    attributes : ['id', 'nome']
                }]
            });

        }

        results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addContasPagar = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }

        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(config.isDev || config.verbose){
            console.log(req.body);
        }

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key];
                }else if(!Object.keys(req.body).includes(key)){
                    return req.block(`Preencha o campo ${key}`);
                }else{
                    obj_create[key] = req.body[key];
                }
            }
        }

        if(parseFloat(obj_create.valor) < parseFloat(obj_create.valor_pago)){
            return res.notAccept('O valor pago não pode ser maior que o valor do título');
        }

        if(Object.keys(obj_create).length==0){
            return res.block('Campo(s) inválido(s)');
        }else{

            const results = await models.ContasPagar.create(obj_create);

            if(results){
                res.json({ error : false, results });
            }else{
                return res.serverError('Ocorreu um erro ao criar título a pagar')
            }

        }

    }

    module.saveContasPagar = async (req, res, next) => {

        const ContasPagar = await models.ContasPagar.findByPk(req.params.id);

        if(ContasPagar){
            
            req.body.datecreated = new Date();

            req.body = sanitize(req.body);

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                    
                        if(key == 'valor_pago'){
                            ContasPagar[key] = parseFloat(ContasPagar[key]) + parseFloat(req.body[key]);
                        }else{
                            ContasPagar[key] = parseFloat(req.body[key]);
                        }
                    
                    }else if(!Object.keys(req.body).includes(key)){
                        return req.block(`Preencha o campo ${key}`);
                    }else{
                        ContasPagar[key] = req.body[key];
                    }
                }
            }

            if(parseFloat(ContasPagar['valor']) < parseFloat(ContasPagar['valor_pago'])){
                return res.notAccept('O valor pago não pode ser maior que o valor do título');
            }

            const results = await ContasPagar.save();

            if(results){
                res.json({ error : false, results });
            }else{
                return res.badRequest('Ocorreu um erro ao salvar a conta');
            }

        }else{
            return res.serverError('Registro não encontrado');
        }

    }

    module.deleteContasPagar = async (req, res, next) => {

        const ContasPagar = await models.ContasPagar.findByPk(req.params.id);

        if(ContasPagar){

            const results = await ContasPagar.destroy();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar 2' });
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', sec.middlewares.csrf_check, module.searchContasPagar)
        .get('/:id?', sec.middlewares.csrf_check, module.getContasPagar)
        .post('/add', xss(), sec.middlewares.sanitize_body, sec.middlewares.csrf_check, module.addContasPagar)
        .put('/save/:id', xss(), sec.middlewares.sanitize_body, sec.middlewares.csrf_check, module.saveContasPagar)
        .delete('/del/:id', xss(), sec.middlewares.csrf_check, module.deleteContasPagar);

    return router;

}