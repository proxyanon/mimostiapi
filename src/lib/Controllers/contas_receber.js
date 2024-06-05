const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

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

            const results = await models.ContasReceber.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar ContasReceber' })
            }

        }

    }

    module.saveContasReceber = async (req, res, next) => {

        const ContasReceber = await models.ContasReceber.findByPk(req.params.id);

        if(ContasReceber){
            
            req.body.datecreated = new Date();

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                        ContasReceber[key] = req.body[key];
                    }else if(!req.body[key]){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        ContasReceber[key] = req.body[key];
                    }
                }
            }

            const results = await ContasReceber.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a conta' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Registro não encontrado' });
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
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', sec.middlewares.csrf_check, module.searchContasReceber)
        .get('/:id?', sec.middlewares.csrf_check, module.getContasReceber)
        .post('/add', sec.middlewares.csrf_check, module.addContasReceber)
        .put('/save/:id', sec.middlewares.csrf_check, module.saveContasReceber)
        .delete('/del/:id', sec.middlewares.csrf_check, module.deleteContasReceber);

    return router;

}