const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

String.prototype.empty = function(){

    var str = this;

    if(!str || !str.length) return true;

    return false;

}

module.exports = () => {

    var module = {};

    module.fields = models.EstoqueProdutoFinal.rawAttributes

    module.searchEstoqueProdutoFinal = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado') };

        const { search } = req.params;

        const results = await models.EstoqueProdutoFinal.findAll({
            where : { especificacao : { [models.sequelize.Op.substring] : search }},
            include : [{
                model : models.Produtos,
                required : false,
                attributes : ['id', 'nome'],
                as : 'produto_nome',
                where : {
                    nome : {
                        [models.sequelize.Op.substring] : search
                    }
                },
            }]
        })
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getEstoqueProdutoFinal = async (req, res, next) => {

        const results = await models.EstoqueProdutoFinal.findAll({ 
            include : [{
                model : models.Produtos,
                required : false,
                attributes : ['id', 'nome'],
                as : 'produto_nome'
            }]
        })

        if(results){
            res.json({ error : false, results, fields : Object.keys(module.fields) })
        }else{
            res.status(500).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) })
        }

    }

    module.addEstoqueProdutoFinal = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

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

        if(estoque_produto_final){
            
            estoque_produto_final['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, estoque_produto_final[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && estoque_produto_final[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        estoque_produto_final[key] = req.body[key]
                    }
                }
            }

            if(parseInt(estoque_produto_final['entrada']) < parseInt(estoque_produto_final['saida'])){
                return res.status(401).json({ error : true, msg : 'A saída não pode ser maior que a entrada' });
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
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchEstoqueProdutoFinal)
        .get('/:id?', module.getEstoqueProdutoFinal)
        .post('/add', module.addEstoqueProdutoFinal)
        .put('/save/:id', module.saveEstoqueProdutoFinal)
        .delete('/del/:id', module.deleteEstoqueProdutoFinal);

    return router;

}