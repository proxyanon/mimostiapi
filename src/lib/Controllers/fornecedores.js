const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

const { xss } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.Fornecedores.rawAttributes

    module.checkCPF_CNPJ = (cpf_cnpj) => {
        
        if(!cpf_cnpj) return false;

        if(cpf_cnpj.length < 14 || cpf_cnpj.length > 18){
            return false
        }

        return true

    }

    module.searchFornecedores = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Fornecedores.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getFornecedores = async (req, res, next) => {

        let results = req.params.id ? await models.Fornecedores.findByPk(req.params.id) : await models.Fornecedores.findAll();

        results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addFornecedor = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Preencha todos os campos' })
        }
        
        req.body.datecreated = new Date();

        for(key in module.fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(400).json({ error : true, msg : `Preencha o campo ${key}` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        if(!module.checkCPF_CNPJ(obj_create.cpf_cnpj)){
            return res.notAccept('O CPF ou CNPJ é inválido');
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.status(500).json({ error : true, msg : 'Requisição inválida' })
        }else{

            const results = await models.Fornecedores.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o fornecedor' })
            }

        }

    }

    module.saveFornecedor = async (req, res, next) => {

        const fornecedor = await models.Fornecedores.findByPk(req.params.id);

        if(fornecedor){
            
            fornecedor['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, fornecedor[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && fornecedor[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        fornecedor[key] = req.body[key]
                    }
                }
            }

            if(!module.checkCPF_CNPJ(fornecedor.cpf_cnpj)){
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await fornecedor.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o fornecedor' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Fornecedor não encontrado' })
        }

    }

    module.deleteFornecedor = async (req, res, next) => {

        const fornecedor = await models.Fornecedores.findByPk(req.params.id);

        if(fornecedor){

            const results = await fornecedor.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        //.use(sec.middlewares.sanitize_body)
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchFornecedores)
        .get('/:id?', module.getFornecedores)
        .post('/add', xss(), sec.middlewares.csrf_check, module.addFornecedor)
        .put('/save/:id', xss(), sec.middlewares.csrf_check, module.saveFornecedor)
        .delete('/del/:id', sec.middlewares.csrf_check, module.deleteFornecedor);

    return router;

}