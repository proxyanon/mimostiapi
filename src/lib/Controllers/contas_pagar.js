const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.fields = models.ContasPagar.rawAttributes

    module.searchContasPagar = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado') };

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

        console.log(req.body);

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
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.ContasPagar.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar ContasPagar' })
            }

        }

    }

    module.saveContasPagar = async (req, res, next) => {

        const ContasPagar = await models.ContasPagar.findByPk(req.params.id);

        if(ContasPagar){
            
            req.body.datecreated = new Date();

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                        ContasPagar[key] = req.body[key];
                    }else if(!req.body[key]){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        ContasPagar[key] = req.body[key];
                    }
                }
            }

            console.log(ContasPagar);

            const results = await ContasPagar.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a conta' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Registro não encontrado' });
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
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', sec.middlewares.csrf_check, module.searchContasPagar)
        .get('/:id?', sec.middlewares.csrf_check, module.getContasPagar)
        .post('/add', sec.middlewares.csrf_check, module.addContasPagar)
        .put('/save/:id', sec.middlewares.csrf_check, module.saveContasPagar)
        .delete('/del/:id', sec.middlewares.csrf_check, module.deleteContasPagar);

    return router;

}