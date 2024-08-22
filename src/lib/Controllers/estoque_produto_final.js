const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const { xss, sanitize } = require('express-xss-sanitizer');

const sec = new Security();
const router = express.Router();

const config = require('../config');

String.prototype.empty = function(){

    var str = this;

    if(!str || !str.length) return true;

    return false;

}

module.exports = () => {

    var module = {};

    module.fields = models.EstoqueProdutoFinal.rawAttributes

    module.empty = (str) => {
    
        if(!str || !str.length || str == '' || str == '\n'){ return true };
    
        return false
    
    }

    module.escapeString = (str) => {

        const db = require('../modules/database');

        let search_scaped = db.escape(`%${str}%`);
        return search_scaped;

    }

    module.searchEstoqueProdutoFinal = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;

        if(module.empty(search)){
            res.notAccept('Digite algo...', module.fields)
        }

        search_scaped = module.escapeString(search);

        const results = await models.EstoqueProdutoFinal.findAll({
            include : [{
                model : models.Produtos,
                required : false,
                attributes : ['id', 'nome', 'descricao'],
                as : 'produto_nome'
            }],
            where : { especificacao : { [models.sequelize.Op.substring] : search } },
            order : [['produto_nome', 'nome', 'ASC']]
        })

        console.log(search, Object.values(results).length, results);
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getEstoqueProdutoFinal = async (req, res, next) => {

        const results = await models.EstoqueProdutoFinal.findAll({ 
            include : [{
                model : models.Produtos,
                required : false,
                attributes : ['id', 'nome', 'descricao', [models.sequelize.literal('entrada - saida'), 'estoque']],
                as : 'produto_nome'
            }],
            order : [['produto_nome', 'nome', 'ASC']]
        })

        if(results){
            res.json({ error : false, results, fields : Object.keys(module.fields) })
        }else{
            res.status(500).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) })
        }

    }

    module.addEstoqueProdutoFinal = async (req, res, next) => {

        let obj_create = {}
        
        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.EstoqueProdutoFinal.tableName.toUpperCase()}] Formulário não aceito`);
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

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.EstoqueProdutoFinal.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o estoque' })
            }

        }

    }

    module.saveEstoqueProdutoFinal = async (req, res, next) => {

        const estoque_produto_final = await models.EstoqueProdutoFinal.findByPk(req.params.id)
        const special_fields = ['id', 'entrada', 'saida'];

        req.body.datecreated = new Date();

        console.log(req.body);

        if(estoque_produto_final){

            for(key in module.fields){
                if(!special_fields.includes(key)){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && module.fields[key].allowNull != null && (req.body[key] != null || req.body[key] != undefined)){
                        estoque_produto_final[key] = module.fields[key].type == 'FLOAT' ? parseFloat(req.body[key]) : parseInt(req.body[key]);
                    }else if(!req.body[key] && module.fields[key].allowNull != false){
                        return res.status(401).json({ error : true, msg : `Campos inválido(s) [${key}]` })
                    }else{
                        estoque_produto_final[key] = req.body[key]
                    }
                }
            }

            estoque_produto_final['entrada'] = parseInt(estoque_produto_final['entrada']) + parseInt(req.body['entrada'])
            estoque_produto_final['saida'] = parseInt(estoque_produto_final['saida']) + parseInt(req.body['saida'])

            if(estoque_produto_final['saida'] > estoque_produto_final['entrada']){
                return res.notAccept('A saída não pode ser maior do que a quantidade do estoque');
            }

            estoque_produto_final['estoque'] = parseInt(estoque_produto_final['entrada']) - parseInt(estoque_produto_final['saida']);

            const results = await estoque_produto_final.save();

            if(results){
                res.json({ error : false, results })
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o estoque' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Estoque não encontrado' })
        }

    }

    module.deleteEstoqueProdutoFinal = async (req, res, next) => {

        const estoque_produto_final = await models.EstoqueProdutoFinal.findByPk(req.params.id);

        if(estoque_produto_final){

            const results = await estoque_produto_final.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }

    }

    router
        .use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchEstoqueProdutoFinal)
        .get('/:id?', module.getEstoqueProdutoFinal)
        //.post('/add', module.addEstoqueProdutoFinal)
        .put('/save/:id', module.saveEstoqueProdutoFinal)
        .delete('/del/:id', module.deleteEstoqueProdutoFinal);

    return router;

}