const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

const config = require('../config');

const { xss, sanitize } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.Clientes.rawAttributes

    module.searchClientes = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Clientes.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getClientes = async (req, res, next) => {

        let results = req.params.id ? await models.Clientes.findByPk(req.params.id) : await models.Clientes.findAll();

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addCliente = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.Clientes.tableName.toUpperCase()}] Formulário não aceito`);
        }

        for(key in module.fields){
            if(key != 'id'){
                if(!req.body[key] && module.fields[key].allowNull == false){
                    if(key == 'cpf_cnpj'){
                        if(!Security.checkCPF_CNPJ(req.body[key])){
                            return res.block('O CPF ou CNPJ inválido');
                        }
                    }
                    return res.block(`Preencha o campo ${key}`);
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        config.isDev && config.verbose ? console.log(obj_create) : '';

        if(Object.keys(obj_create).length==0){
            return res.block('Formulário inválido');
        }else{

            const results = await models.Clientes.create(obj_create);

            if(results){
                await res.sendOkResponse();
            }else{
                res.serverError('Ocorreu um erro ao criar cliente')
            }

        }

    }

    module.saveCliente = async (req, res, next) => {

        const cliente = await models.Clientes.findByPk(req.params.id);

        if(cliente){
            
            cliente['datecreated'] = new Date();

            req.body = sanitize(req.body);

            for(key in module.fields){
                console.log(key, cliente[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull == false && cliente[key].toString().empty()){
                        return res.block(`Preencha o campo ${key}`);
                    }else{
                        cliente[key] = req.body[key]
                    }
                }
            }

            if(!Security.checkCPF_CNPJ(cliente.cpf_cnpj)){
                return res.notAccept('O CPF ou CNPJ é inválido');
            }

            const results = await cliente.save();

            if(results){
                await res.sendData(results);
            }else{
                res.badRequest('Ocorreu um erro ao salvar o cliente');
            }

        }else{
            res.serverError('Cliente não encontrado');
        }

    }

    module.deleteCliente = async (req, res, next) => {

        const cliente = await models.Clientes.findByPk(req.params.id);

        if(cliente){

            const results = await cliente.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .use(sec.middlewares.csrf_check)
        .get('/search/:search', module.searchClientes)
        .get('/:id?', module.getClientes)
        .post('/add', xss(), module.addCliente)
        .put('/save/:id', sec.middlewares.sanitize_body, xss(), sec.middlewares.csrf_check, module.saveCliente)
        .delete('/del/:id', module.deleteCliente);

    return router;

}