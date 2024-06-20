const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

const config = require('../config');
const { xss } = require('express-xss-sanitizer')

module.exports = () => {

    var module = {};

    module.fields = models.Funcionarios.rawAttributes

    module.checkCPF_CNPJ = (cpf_cnpj) => {
        
        if(cpf_cnpj.length < 14 || cpf_cnpj.length > 18){
            return false
        }

        return true

    }

    module.searchFuncionarios = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Funcionarios.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getFuncionarios = async (req, res, next) => {

        let results = req.params.id ? await models.Funcionarios.findByPk(req.params.id) : await models.Funcionarios.findAll();

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addFuncionario = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

        config.isDev && config.verbose ? console.log(req.body) : '';

        for(key in module.fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(400).json({ error : true, msg : `Preencha o campo ${key}` });
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        config.isDev && config.verbose ? console.log(obj_create) : '';

        if(Object.keys(obj_create).length==0){
           return res.notAccept('Requisição inválida');
        }else{

            config.isDev && config.verbose ? console.log(obj_create) : '';

            if(!module.checkCPF_CNPJ(obj_create.cpf_cnpj)){
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await models.Funcionarios.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o ornecedor' })
            }

        }

    }

    module.saveFuncionario = async (req, res, next) => {

        const funcionario = await models.Funcionarios.findByPk(req.params.id);

        if(funcionario){
            
            funcionario['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, funcionario[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && funcionario[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        funcionario[key] = req.body[key]
                    }
                }
            }

            if(!module.checkCPF_CNPJ(funcionario.cpf_cnpj)){
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await funcionario.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o funcionario' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Funcionario não encontrado' })
        }

    }

    module.deleteFuncionario = async (req, res, next) => {

        const funcionario = await models.Funcionarios.findByPk(req.params.id);

        if(funcionario){

            const results = await funcionario.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchFuncionarios)
        .get('/:id?', module.getFuncionarios)
        .post('/add', xss(), module.addFuncionario)
        .put('/save/:id', xss(), module.saveFuncionario)
        .delete('/del/:id', module.deleteFuncionario);

    return router;

}