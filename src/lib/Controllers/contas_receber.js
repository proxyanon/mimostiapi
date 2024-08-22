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

    module.fields = models.ContasReceber.rawAttributes

    module.searchContasReceber = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.ContasReceber.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getContasReceber = async (req, res, next) => {

        let results = null;

        if(req.params.id){

            results = await models.ContasReceber.findByPk(req.params.id, {
                include : [{
                    model : models.Clientes,
                    attributes : ['id', 'nome']
                }, {
                    model : models.FormasPagamentos,
                    attributes : ['id', 'nome']
                }]
            })

        }else{

            results = await models.ContasReceber.findAll({
                include : [{
                    model : models.Clientes,
                    attributes : ['id', 'nome']
                }, {
                    model : models.FormasPagamentos,
                    attributes : ['id', 'nome']
                }]
            });

        }

        results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addContasReceber = async (req, res, next) => {

        let obj_create = {}

        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.ContasReceber.tableName.toUpperCase()}] Formulário não aceito`);
        }

        if(config.isDev || config.verbose){
            console.log(req.body);
        }

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (module.fields[key].allowNull != false) && (req.body[key] != null || req.body[key] != undefined)){
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

            const results = await models.ContasReceber.create(obj_create);

            if(results){
                res.json({ error : false, results });
            }else{
                return res.serverError('Ocorreu um erro ao criar título a pagar')
            }

        }

    }

    module.saveContasReceber = async (req, res, next) => {

        const ContasReceber = await models.ContasReceber.findByPk(req.params.id);

        if(ContasReceber){

            if(ContasReceber['pago'] == true){
                return res.notAccept('O título já foi pago');
            }
            
            req.body.datecreated = new Date();

            req.body = sanitize(req.body);

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (module.fields[key].allowNull != false) && (req.body[key] != null || req.body[key] != undefined)){
                        if(key == 'valor_pago'){
                            ContasReceber[key] = parseFloat(ContasReceber[key]) + parseFloat(req.body[key]);
                        }else{
                            ContasReceber[key] = module.fields[key].type == 'FLOAT' ? parseFloat(req.body[key]) : parseInt(req.body[key]);
                        }
                    }else if(module.fields[key].type == 'BOOLEAN'){
                        ContasReceber[key] = Boolean(req.body[key]);
                    }else if(!Object.keys(req.body).includes(key)){
                        return res.block(`Preencha o campo ${key}`);
                    }else{
                        ContasReceber[key] = req.body[key];
                    }
                }
            }

            console.log(Object.values(ContasReceber))
            console.log(req.body)

            if(parseFloat(ContasReceber['valor']) < parseFloat(ContasReceber['valor_pago'])){
                return res.notAccept('O valor pago não pode ser maior que o valor do título');
            }

            if(parseFloat(ContasReceber['valor']) == parseFloat(ContasReceber['valor_pago'])){
                ContasReceber['pago'] = true;
            }

            const results = await ContasReceber.save();

            if(results){
                res.json({ error : false, results });
            }else{
                return res.badRequest('Ocorreu um erro ao salvar a conta');
            }

        }else{
            return res.serverError('Registro não encontrado');
        }

    }

    module.deleteContasReceber = async (req, res, next) => {

        const ContasReceber = await models.ContasReceber.findByPk(req.params.id);

        if(ContasReceber){

            const results = await ContasReceber.destroy();

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
        .get('/search/:search', module.searchContasReceber)
        .get('/:id?', module.getContasReceber)
        .post('/add', xss(), sec.middlewares.sanitize_body, module.addContasReceber)
        .put('/save/:id', xss(), sec.middlewares.sanitize_body, module.saveContasReceber)
        .delete('/del/:id', xss(), module.deleteContasReceber);

    return router;

}