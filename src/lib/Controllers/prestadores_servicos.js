const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

const config = require('../config');
const { xss, sanitize } = require('express-xss-sanitizer');

module.exports = () => {

    var module = {};

    module.fields = models.PrestadoresServicos.rawAttributes

    module.searchPrestadoresServicos = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.PrestadoresServicos.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getPrestadoresServicos = async (req, res, next) => {

        let results = req.params.id ? await models.PrestadoresServicos.findByPk(req.params.id) : await models.PrestadoresServicos.findAll();        

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addPrestadoreServico = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.PrestadoresServicos.tableName.toUpperCase()}] Formulário não aceito`);
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

        if(!Security.checkCPF_CNPJ(obj_create.cpf_cnpj)){
            return res.notAccept('O cpf ou cnpj é inválido');
        }

        config.isDev && config.verbose ? console.log(obj_create) : '';

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.PrestadoresServicos.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o ornecedor' })
            }

        }

    }

    module.savePrestadoreServico = async (req, res, next) => {

        const prestador_servico = await models.PrestadoresServicos.findByPk(req.params.id);

        if(prestador_servico){
            
            prestador_servico['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, prestador_servico[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && prestador_servico[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        prestador_servico[key] = req.body[key]
                    }
                }
            }

            if(!Security.checkCPF_CNPJ(prestador_servico.cpf_cnpj)){
                return res.notAccept('O cpf ou cnpj é inválido');
            }

            const results = await prestador_servico.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o prestador_servico' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Prestador de servico não encontrado' })
        }

    }

    module.deletePrestadoreServico = async (req, res, next) => {

        const prestador_servico = await models.PrestadoresServicos.findByPk(req.params.id);

        if(prestador_servico){

            const results = await prestador_servico.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .use(sec.middlewares.csrf_check)
        .get('/search/:search', module.searchPrestadoresServicos)
        .get('/:id?', module.getPrestadoresServicos)
        .post('/add', xss(), module.addPrestadoreServico)
        .put('/save/:id', sec.middlewares.sanitize_body, xss(), module.savePrestadoreServico)
        .delete('/del/:id', module.deletePrestadoreServico);

    return router;

}