const { Op, QueryTypes } =  require('sequelize');
const express = require('express');
const models = require('../modules/models')

const Security = require('../modules/Security');
const sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.fields = models.Produtos.rawAttributes

    module.searchProduct = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;

        const db = require('../modules/database');
        let search_scaped = db.escape(`%${search}%`);

        const results = await models.Produtos.findAll({
            where : { 
                [models.sequelize.Op.or] : [
                    { nome : { [models.sequelize.Op.substring] : search } },
                    { codigo_barras : { [models.sequelize.Op.substring] : search } },
                    models.sequelize.literal(`produtos_seco.nome LIKE ${search_scaped}`),
                    models.sequelize.literal(`produtos_categoria.nome LIKE ${search_scaped}`),
                    models.sequelize.literal(`produtos_cor.nome LIKE ${search_scaped}`)
                ],
            },
            include : [{
                model : models.ProdutosCategorias,
                required : true,
                attributes : ['id', 'nome']
            },{
                model : models.ProdutosSecoes,
                required : true,
                attributes : ['id', 'nome']
            },{
                model : models.ProdutosCor,
                required : false,
                attributes : ['id', 'nome']
            },{
                model : models.EstoqueProdutoFinal,
                required : false,
                attributes : ['id', [models.sequelize.literal('entrada - saida'), 'estoque']]
            }],
            order : [['nome', 'ASC']] 
        })
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });
    }

    module.getProdutos = async (req, res, next) => {

        let results = null;

        if(!req.params.id){

            results = await models.Produtos.findAll({ 
                include : [{
                    model : models.ProdutosCategorias,
                    required : true,
                    attributes : ['id', 'nome']
                },{
                    model : models.ProdutosSecoes,
                    required : true,
                    attributes : ['id', 'nome']
                },{
                    model : models.ProdutosCor,
                    required : false,
                    attributes : ['id', 'nome']
                },{
                    model : models.EstoqueProdutoFinal,
                    required : false,
                    attributes : ['id', [models.sequelize.literal('entrada - saida'), 'estoque']]
                }],
                order : [['nome', 'ASC']] 
            });

        }else{

            results = await models.Produtos.findByPk(req.params.id, {
                include : [{
                    model : models.ProdutosCategorias,
                    required : true,
                    attributes : ['id', 'nome']
                },{
                    model : models.ProdutosSecoes,
                    required : true,
                    attributes : ['id', 'nome']
                },{
                    model : models.ProdutosCor,
                    required : false,
                    attributes : ['id', 'nome']
                },{
                    model : models.EstoqueProdutoFinal,
                    required : false,
                    attributes : ['id', [models.sequelize.literal('entrada - saida'), 'estoque']]
                }],
                order : [['nome', 'ASC']]
            });

        }

        results ? res.success(results, module.fields) : res.notFound('Nada encontrado', module.fields);
        //results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });
    }

    module.getProduto = async (req, res, next) => {

        try{

            const results = await models.Produtos.findByPk(req.params.id);

            if(results.length){
                res.json({ error : false, results });
            }else{
                res.status(404).json({ error : true, msg : 'Nada encontrado' });
            }

        }catch(err){
            res.status(500).json({ error : true, msg : 'Erro no servidor' });
        }

    }

    module.getProdutosByCategoria = async (req, res, next) => {

        try{
            
            const results = await models.Produtos.findAll({ where : { categoria : req.params.id } });

            if(results.length){
                res.json({ error : false, results });
            }else{
                res.status(404).json({ error : true, msg : 'Nada encontrado' });
            }

        }catch(err){
            console.error(err);
            res.status(500).json({ error : true, msg : 'Erro no servidor' });
        }

    }

    module.getProdutosInIds = async (req, res, next) => {

        const { produtos } = req.body;

        if(produtos.length>0){

            const results = await models.Produtos.findAll({ where : {
                id : {
                    [Op.in] : produtos
                }
            } })

            if(results.length){
                res.json({ error : false, results });
            }else{
                res.status(500).json({ error : true, msg : 'Nada encontrado' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Nenhum produto no pedido' });
        }

    }

    module.addProduto = async (req, res, next) => {

        let obj_create = {}
        let fields = models.Produtos.rawAttributes;

        let produto_entrada = req.body['quantidade'];

        delete req.body['quantidade'];

        req.body.datecreated = new Date();
        req.body.codigo_barras = Security.generatebarcode(10);
        req.body.usuario = req.session.session_username

        if(Object.keys(fields).length!=Object.keys(fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }

        for(key in fields){
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

            let results = null;
            console.log(obj_create);

            try{
                results = await models.Produtos.create(obj_create);
            }catch(err){
                console.error(err);
            }

            if(results){

                let obj_create_estoque = {};

                obj_create_estoque.produto = results.id;
                obj_create_estoque.cor = results.cor;
                obj_create_estoque.especificacao = results.nome;
                obj_create_estoque.entrada = parseInt(produto_entrada);
                obj_create_estoque.saida = 0;
                obj_create_estoque.datecreated = new Date();

                const results_estoque = await models.EstoqueProdutoFinal.create(obj_create_estoque);

                if(results_estoque){
                    res.sendOkResponse();
                }else{
                    res.notAccept('Ocorreu um erro ao lançar produto no estoque');
                }
            
            }else{
                res.serverError('Ocorreu um erro ao criar seção')
            }

        }

    }

    module.addProdutoSecao = async (req, res, next) => {
        
        let obj_create = {}
        let fields = models.ProdutosSecoes.rawAttributes;

        if(Object.keys(fields).length!=Object.keys(fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }

        console.log(req.body);

        for(key in fields){
            if(key != 'id'){
                if(!req.body[key]){
                    return res.status(401).json({ error : true, msg : `Campos inválido(s) [${key}]` })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.ProdutosSecoes.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar seção' })
            }

        }

    }

    module.addProdutoCategoria = async (req, res, next) => {
        
        let obj_create = {}
        let fields = models.ProdutosCategorias.rawAttributes;

        if(Object.keys(fields).length!=Object.keys(fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }

        console.log(req.body);

        for(key in fields){
            if(key != 'id'){
                if(!req.body[key]){
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

            const results = await models.ProdutosCategorias.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar seção' })
            }

        }

    }

    module.addProdutoCor = async (req, res, next) => {
        
        let obj_create = {}
        let fields = models.ProdutosSecoes.rawAttributes;

        if(Object.keys(fields).length!=Object.keys(fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }

        console.log(req.body);

        for(key in fields){
            if(key != 'id'){
                if(!req.body[key]){
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

            const results = await models.ProdutosCor.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar seção' })
            }

        }

    }

    module.getSecoes = async (req, res, next) => {
        
        const results = req.params.id ? await models.ProdutosSecoes.findByPk(req.params.id) : await models.ProdutosSecoes.findAll();

        results ? res.json({ error : false, results }) : res.status(404).json({ error : true, msg : 'Nada encontrado' });

    }    

    module.getCategorias = async (req, res, next) => {
        
        const results = req.params.id ? await models.ProdutosCategorias.findByPk(req.params.id) : await models.ProdutosCategorias.findAll({});
        
        results ? res.json({ error : false, results }) : res.status(404).json({ error : true, msg : 'Nada encontrado' });

    }

    module.getCores = async (req, res, next) => {

        const results = req.params.id ? await models.ProdutosCor.findByPk(req.params.id) : await models.ProdutosCor.findAll();

        results ? res.json({ error : false, results }) : res.status(404).json({ error : true, msg : 'Nada encontrado' });

    }

    module.saveProduto = async (req, res, next) =>{

        const produto = await models.Produtos.findByPk(req.params.id);

        if(produto){
            
            produto['datecreated'] = new Date();

            Object.keys(produto).includes('quantidade') ? delete req.body['quantidade'] : '';

            for(key in module.fields){
                console.log(key, produto[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && produto[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        produto[key] = req.body[key]
                    }
                }
            }

            const results = await produto.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar o produto' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'produto não encontrado' })
        }

    }

    module.saveSecao = async (req, res, next) => {
        
        const secao = await models.ProdutosSecoes.findByPk(req.params.id);
        let fields = models.ProdutosSecoes.rawAttributes;

        if(secao){
            
            //secao['datecreated'] = new Date();

            for(key in fields){
                if(key != 'id' && req.body[key]){
                    if(fields[key].allowNull != false && secao[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        secao[key] = req.body[key]
                    }
                }
            }

            const results = await secao.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a seção' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'seção não encontrado' })
        }

    }

    module.saveCategoria = async (req, res, next) => {
        
        const categoria = await models.ProdutosCategorias.findByPk(req.params.id);
        let fields = models.ProdutosCategorias.rawAttributes;

        if(categoria){
            
            //categoria['datecreated'] = new Date();

            for(key in fields){
                if(key != 'id' && req.body[key]){
                    if(fields[key].allowNull != false && categoria[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        categoria[key] = req.body[key]
                    }
                }
            }

            const results = await categoria.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a categoria' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'categoria não encontrado' })
        }

    }

    module.saveCor = async (req, res, next) => {

        const cor = await models.ProdutosCor.findByPk(req.params.id);
        let fields = models.ProdutosCor.rawAttributes;

        if(cor){
            
            //cor['datecreated'] = new Date();

            for(key in fields){
                if(key != 'id' && req.body[key]){
                    if(fields[key].allowNull != false && cor[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        cor[key] = req.body[key]
                    }
                }
            }

            const results = await cor.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a seção' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'seção não encontrado' })
        }

    }

    module.deleteProduto = async (req, res, next) => {

        try{
            const estoque_produto_final = await models.EstoqueProdutoFinal.destroy({
                where : {
                    produto : req.params.id
                }
            });
        }catch(err){
            return res.status(500).json({ error : true, msg : 'Erro ao deletar estoque de produto final' });
        }

        const produto = await models.Produtos.findByPk(req.params.id);

        if(produto){

            const results = await produto.destroy();
            res.json({ error : false, results });

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' })
        }


    }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchProduct)
        .get('/secao/:id?', module.getSecoes)
        .get('/categoria/:id?', module.getCategorias)
        .get('/cor/:id?', module.getCores)
        .get('/:id?', module.getProdutos)
        //.post('/', module.getProdutosInIds)
        .delete('/del/:id', module.deleteProduto)
        .post('/add', module.addProduto)
        .put('/secao/save/:id', module.saveSecao)
        .put('/categoria/save/:id', module.saveCategoria)
        .put('/cor/save/:id', module.saveCor)
        .put('/save/:id', module.saveProduto)
        .post('/secao/add', module.addProdutoSecao)
        .post('/categoria/add', module.addProdutoCategoria)
        .post('/cor/add', module.addProdutoCor)

    return router;

}