const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.fields = models.FormasPagamentos.rawAttributes;

    module.searchFormaPagamento = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado') };

        const { search } = req.params;
            
        const results = await models.FormasPagamentos.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getFormaPagamento = async (req, res, next) => {
        
        let results = req.params.id ? await models.FormasPagamentos.findByPk(req.params.id) : await models.FormasPagamentos.findAll();

        results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addFormaPagamento = async (req, res, next) => {

        let obj_create = {};
        let fields = models.FormasPagamentos.rawAttributes;

        if(Object.keys(fields).length!=Object.keys(fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

        for(key in fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : `Campos inválido(s) 2 [${key}]` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.FormasPagamentos.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar FormaPagamento' })
            }

        }

    }

    module.saveFormaPagamento = async (req, res, next) => {

        const FormaPagamento = await models.FormasPagamentos.findByPk(req.params.id);

        if(FormaPagamento){
            
            FormaPagamento['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, FormaPagamento[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && FormaPagamento[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        FormaPagamento[key] = req.body[key]
                    }
                }
            }

            const results = await FormaPagamento.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o FormaPagamento' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'FormaPagamento não encontrado' })
        }

    }

    module.deleteFormaPagamento = async (req, res, next) => {

        const FormaPagamento = await models.FormasPagamentos.findByPk(req.params.id);

        if(FormaPagamento){

            const results = await FormaPagamento.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        //.use(sec.middlewares.auth_check)
        //.use(sec.responses.setResponses)
        .get('/search/:search', module.searchFormaPagamento)
        .get('/:id?', module.getFormaPagamento)
        .post('/add', module.addFormaPagamento)
        .put('/save/:id', module.saveFormaPagamento)
        .delete('/del/:id', module.deleteFormaPagamento);

    return router;

}