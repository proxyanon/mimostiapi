const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const { xss, sanitize } = require('express-xss-sanitizer');

const sec = new Security();
const router = express.Router();

const config = require('../config');

module.exports = () => {

    var module = {};

    module.fields = models.EstoqueMaterialProducao.rawAttributes

    module.searchEstoqueMaterialProducao = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.EstoqueMaterialProducao.findAll({ 
            where : { especificao : { [ models.sequelize.Op.substring ] : search }},
            order : [['especificao', 'ASC']]
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getEstoqueMaterialProducao = async (req, res, next) => {

        const results = await models.EstoqueMaterialProducao.findAll({ 
            include : [{
                model : models.ProdutosCor,
                required : false,
                attributes : ['id', 'nome']
            }],
            order : [['especificacao', 'ASC']]
        })

        if(results){
            res.json({ error : false, results, fields : Object.keys(module.fields) })
        }else{
            res.serverError('Nada encontrado', module.fields);
        }

    }

    module.addEstoqueMaterialProducao = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.EstoqueMaterialProducao.tableName.toUpperCase()}] Formulário não aceito`);
        }

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key]
                }else if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : 'Campos inválido(s) 2' })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.block('Preencha o formulário completo');
        }else{

            const results = await models.EstoqueMaterialProducao.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o ornecedor' })
            }

        }

    }

    module.saveEstoqueMaterialProducao = async (req, res, next) => {

        const estoque_material_producao = await models.EstoqueMaterialProducao.findByPk(req.params.id)

        if(estoque_material_producao){
            
            estoque_material_producao['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, estoque_material_producao[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && estoque_material_producao[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        estoque_material_producao[key] = req.body[key]
                    }
                }
            }

            if((parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida'])) <= 0){
                return req.block('O estoque não pode ser menor que zero digite uma saída menor ou uma entrada maior');
            }

            if((parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida'])) <= estoque_material_producao['entrada']){
                return res.block('A saída não pode ser maior que a entrada');
            }

            estoque_material_producao['estoque'] = parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida']);

            const results = await estoque_material_producao.save();

            if(results){
                res.json({ error : false, results })
            }else{
                res.block('Ocorreu um erro ao salvar o estoque');
            }

        }else{
            res.serverError('Estoque não encontrado')
        }

    }

    module.deleteEstoqueMaterialProducao = async (req, res, next) => {

        const estoque_material_producao = await models.EstoqueMaterialProducao.findByPk(req.params.id);

        if(estoque_material_producao){

            const results = await estoque_material_producao.destroy();
            res.json({ error : false, results });

        }else{
            res.serverError('Ocorreu um erro ao deletar');
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchEstoqueMaterialProducao)
        .get('/:id?', module.getEstoqueMaterialProducao)
        .post('/add', xss(), module.addEstoqueMaterialProducao)
        .put('/save/:id', xss(), sec.middlewares.sanitize_body, module.saveEstoqueMaterialProducao)
        .delete('/del/:id', module.deleteEstoqueMaterialProducao);

    return router;

}