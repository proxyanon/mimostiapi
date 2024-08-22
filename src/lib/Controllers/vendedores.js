const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

const config = require('../config');
const { xss, sanitize } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.Vendedores.rawAttributes

    module.searchVendedores = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Vendedores.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });

        results.length > 0 ? await res.sendData(results, module.fields) : res.notFound('Nada encontrado', module.fields);
        
        //results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getVendedores = async (req, res, next) => {

        let results = req.params.id ? await models.Vendedores.findByPk(req.params.id) : await models.Vendedores.findAll();

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addVendedor = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block('Formulário não aceito');
        }

        for(key in module.fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(400).json({ error : true, msg : `Preencha o campo ${key}` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        config.isDev && config.verbose ? console.log(obj_create) : '';

        if(Object.keys(obj_create).length==0){
            return res.notAccept('Requisição inválida');
        }else{

            if(!Security.checkCPF_CNPJ(obj_create.cpf_cnpj)){
                console.log(obj_create)
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await models.Vendedores.create(obj_create);

            if(results){
                await res.sendOkresponse();
            }else{
                res.serverError('Ocorreu um erro ao criar o fornecedor');
            }

        }

    }

    module.saveVendedor = async (req, res, next) => {

        const vendedor = await models.Vendedores.findByPk(req.params.id);

        if(vendedor){
            
            vendedor['datecreated'] = new Date();

            for(key in module.fields){
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull == false && vendedor[key].toString().empty()){
                        return res.status(400).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        vendedor[key] = req.body[key]
                    }
                }
            }

            if(!Security.checkCPF_CNPJ(vendedor.cpf_cnpj)){
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await vendedor.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o vendedor' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'vendedor não encontrado' })
        }

    }

    module.deleteVendedor = async (req, res, next) => {

        const vendedor = await models.Vendedores.findByPk(req.params.id);

        if(vendedor){

            const results = await vendedor.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .use(sec.middlewares.csrf_check)
        //.use(sec.middlewares.sanitize_body)
        .get('/search/:search', module.searchVendedores)
        .get('/:id?', module.getVendedores)
        .post('/add', xss(), module.addVendedor)
        .put('/save/:id', sec.middlewares.sanitize_body, xss(), module.saveVendedor)
        .delete('/del/:id', module.deleteVendedor);

    return router;

}