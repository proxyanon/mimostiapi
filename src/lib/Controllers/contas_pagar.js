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

        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.ContasPagar.tableName.toUpperCase()}] Formulário não aceito`);
        }

        if(config.isDev || config.verbose){
            console.log(req.body);
        }

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (module.fields[key].allowNull == false) && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key];
                }else if(module.fields[key].type == 'BOOLEAN'){
                    obj_create[key] = Boolean(req.body[key]);
                }else if(!Object.keys(req.body).includes(key)){
                    return res.notAccept(`Preencha o campo ${key}`);
                }else{
                    obj_create[key] = req.body[key];
                }
            }
        }

        if(parseFloat(obj_create.valor) < parseFloat(obj_create.valor_pago)){
            return res.notAccept('O valor pago não pode ser maior que o valor do título');
        }

        if(Object.keys(obj_create).length==0){
            return res.notAccept('Campo(s) inválido(s)');
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

            if(ContasPagar['pago'] == true){
                return res.notAccept('O título já foi pago');
            }
            
            req.body.datecreated = new Date();

            req.body = sanitize(req.body);

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (module.fields[key].allowNull == false)  && (req.body[key] != null || req.body[key] != undefined)){
                    
                        if(key == 'valor_pago'){
                            ContasPagar[key] = parseFloat(ContasPagar[key]) + parseFloat(req.body[key]);
                        }else{
                            ContasPagar[key] = module.fields[key].type == 'FLOAT' ? parseFloat(req.body[key]) : parseInt(req.body[key]);
                        }
                    }else if(module.fields[key].type == 'BOOLEAN'){
                        ContasPagar[key] = Boolean(req.body[key]);
                    }else if(!Object.keys(req.body).includes(key)){
                        return res.block(`Preencha o campo ${key}`);
                    }else{
                        ContasPagar[key] = req.body[key];
                    }
                }
            }

            if(parseFloat(ContasPagar['valor']) < parseFloat(ContasPagar['valor_pago'])){
                return res.notAccept('O valor pago não pode ser maior que o valor do título');
            }

            if(parseFloat(ContasPagar['valor']) == parseFloat(ContasPagar['valor_pago'])){
                ContasPagar['pago'] = true;
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
        .use(sec.middlewares.csrf_check)
        .get('/search/:search', module.searchContasPagar)
        .get('/:id?', module.getContasPagar)
        .post('/add', xss(), sec.middlewares.sanitize_body, module.addContasPagar)
        .put('/save/:id', xss(), sec.middlewares.sanitize_body, module.saveContasPagar)
        .delete('/del/:id', xss(), module.deleteContasPagar);

    return router;

}