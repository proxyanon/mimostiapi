const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');
const moment = require('moment');
const { xss, sanitize } = require('express-xss-sanitizer');

const sec = new Security();
const router = express.Router();

const config = require('../config');

moment.locale('pt-br');

module.exports = () => {

    var module = {};

    module.fields = models.CaixaTemp.rawAttributes;

    module.searchCaixa = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Caixa.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getCaixa = async (req, res, next) => {

        let fields = models.Caixa.rawAttributes;
        
        let results = req.params.id ? await models.Caixa.findByPk(req.params.id) : await models.Caixa.findAll();

        results ? res.json({ error : false, results, fields : Object.keys(fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(fields) });

    }

    module.getCaixaTemp = async (req, res, next) => {

        const caixa = await models.Caixa.findByPk(req.params.id);

        if(!caixa){
            return res.status(404).json({ error : true, msg : 'Caixa não encontrado' });
        }

        let periodoInicial = moment(caixa.datecreated, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

        const results = await models.CaixaTemp.findAll({
            where : { 
                caixa_id : req.params.id,
                datecreated : {
                    [models.sequelize.Op.between] : [periodoInicial, moment().format('YYYY-MM-DD HH:mm:ss')]
                }
            },
            include : [{
                model : models.Caixa,
                required : false,
                attributes : ['id', 'nome', 'descricao']
            }, {
                model : models.Produtos,
                required : true,
                attributes : ['id', 'nome']
            }, {
                model : models.FormasPagamentos,
                required : false,
                attributes : ['id', 'nome']
            }]
        });

        if(results){
            res.json({ error : false, results, fields : Object.keys(module.fields) })
        }else{
            res.status(500).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) })
        }

    }

    module.addCaixa = async (req, res, next) => {

        let obj_create = {};
        let fields = models.Caixa.rawAttributes;
        
        req.body.datecreated = moment().format('YYYY-MM-DD HH:mm:ss');1

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block('Formulário não aceito');
        }

        for(key in fields){
            if(key != 'id'){
                if((fields[key].type == 'FLOAT' || fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key]
                }else if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : `Campos inválido(s) 2 [${key}]` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.Caixa.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar Caixa' })
            }

        }

    }

    module.saveCaixa = async (req, res, next) => {

        const Caixa = await models.Caixa.findByPk(req.params.id);

        if(Caixa){
            
            Caixa['datecreated'] = moment().format('YYYY-MM-DD HH:mm:ss');

            for(key in module.fields){
                console.log(key, Caixa[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && Caixa[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        Caixa[key] = req.body[key]
                    }
                }
            }

            const results = await Caixa.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o Caixa' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Caixa não encontrado' })
        }

    }

    module.deleteCaixa = async (req, res, next) => {

        const Caixa = await models.Caixa.findByPk(req.params.id);

        if(Caixa){

            const results = await Caixa.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    module.addCaixaTemp = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = moment().format('YYYY-MM-DD HH:mm:ss');

        req.body = sanitize(req.body);

        /*if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.Caixa.tableName.toUpperCase()}] Formulário não aceito`);
        }*/

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key]
                }else if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : `Campos inválido(s) 2 [${key}]` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            let quantidade = parseInt(req.body['quantidade']);
            let valor = req.body['valor'];

            if(quantidade <= 0){
                return res.status(401).json({ error : true, msg : 'A quantidade tem que ser maior que zero' });
            }

            let estoque = await models.EstoqueProdutoFinal.findOne({
                where : { produto : obj_create['produto_id'] } 
            });

            const caixa = await models.Caixa.findByPk(obj_create['caixa_id']);

            console.log('CAIXA DATA', caixa);

            if(estoque){

                let estoque_val = parseInt(estoque['entrada']) - parseInt(estoque['saida']);

                if(estoque_val <= 0){
                    return res.status(401).json({ error : true, msg : 'Este produto não tem estoque' });
                }else if(estoque_val < quantidade){
                    return res.status(401).json({ error : true, msg : 'Este produto não tem essa quantide no estoque' })
                }

                estoque['saida'] = parseInt(estoque['saida']) + quantidade;
                estoque['datecreated'] = new Date();
                
                try{
                    results = await estoque.save();
                }catch(err){
                    console.error(err);
                }

                if(results && caixa){
                    caixa['entrada'] = parseFloat(caixa['entrada']) + parseFloat(valor);
                }
    
                try{
                    results = await caixa.save();
                }catch(err){
                    console.error(err);
                }
    
                if(results){
                    caixa['saldo'] = parseFloat(valor) + parseFloat(caixa['saldo']);
                }
    
                results = await caixa.save();
    
                if(results){

                    try{
                    
                        results = await models.CaixaTemp.create(obj_create);
                        res.json({ error : false, results });
                    
                    }catch(err){

                        console.error(err);
                        res.status(500).json({ error : true, msg : 'Error ao salvar a venda' });

                    }

                
                }else{
                    res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar Caixa' })
                }

            }else{
                res.status(404).json({ error : true,  })
            }

        }

    }

    module.saidaCaixa = async (req, res, next) => {

        let fields = models.Caixa.rawAttributes;

        if(!req.body['saida']){
            return res.status(401).json({ error : true, msg : 'Campo inválido [saida]' });
        }
        
        const caixa = await models.Caixa.findByPk(req.params.id);

        caixa['saida'] = parseFloat(caixa['saida']) + parseFloat(req.body['saida']);
        
        let results = await caixa.save();

        if(results){
            caixa['saldo'] = parseFloat(caixa['saldo']) - parseFloat(caixa['saida']);
        }else{
            return res.status(500).json({ error : true, msg : 'Ocorreu um error lançar a saída' });
        }

        results = await caixa.save();

        if(results){
            res.json({ error : false, results, fields });
        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao atulizar o saldo do caixa' })
        }

    }

    module.abrirCaixa = async (req, res, next) => {

        const caixa = await models.Caixa.findByPk(req.params.id);

        if(caixa){

            // caixa.entrada = 0;
            // caixa.saida = 0;
            caixa.datecreated = moment().format('YYYY-MM-DD HH:mm:ss');

            const results = await caixa.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(500).json({ error : true, msg : `Erro ao abrir o caixa [${caixa.nome}]` });
            }

        }else{
            res.status(404).json({ error : true, msg : 'Caixa não encontrado' });
        }

    }

    module.fecharCaixa = async (req, res, next) => {

        const caixa = await models.Caixa.findByPk(req.params.id);

        if(caixa){

            caixa.entrada = 0;
            caixa.saida = 0;
            caixa.datecreated = moment().format('YYYY-MM-DD HH:mm:ss');

            const results = await caixa.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(500).json({ error : true, msg : `Erro ao fechar o caixa [${caixa.nome}]` });
            }

        }else{
            res.status(404).json({ error : true, msg : 'Caixa não encontrado' });
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .use(sec.middlewares.csrf_check)
        .get('/search/:search', module.searchCaixa)
        .get('/temp/:id', module.getCaixaTemp)
        .get('/fechar/:id', module.fecharCaixa)
        .get('/abrir/:id', module.abrirCaixa)
        .get('/:id?', module.getCaixa)
        .post('/temp/add', xss(), module.addCaixaTemp)
        .post('/saida/:id', xss(), module.saidaCaixa)
        .post('/add', xss(), module.addCaixa)
        .put('/save/:id', xss(), sec.middlewares.sanitize_body, module.saveCaixa)
        .delete('/del/:id', module.deleteCaixa);

    return router;

}