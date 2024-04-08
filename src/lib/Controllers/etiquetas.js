const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

module.exports = () => {

    var module = {};

    module.fields = models.Produtos.rawAttributes

    module.searchEtiquetas = async (req, res, next) => {

        if(!req.params.search){ return res.notAccept('Nada digitado') };

        const { search } = req.params;

        const db = require('../modules/database');
        let search_scaped = db.escape(`%${search}%`);

        const results = await models.Produtos.findAll({
            where : { 
                [models.sequelize.Op.or] : [
                    { nome : { [models.sequelize.Op.substring] : search } },
                    { codigo_barras : { [models.sequelize.Op.substring] : search } },
                    models.sequelize.literal(`produtos_seco.nome LIKE ${search_scaped}`),
                    models.sequelize.literal(`produtos_cor.nome LIKE ${search_scaped}`)
                ],
            },
            include : [{
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
            order : [['produtos_seco', 'id'], ['produtos_cor', 'nome']] 
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getEtiquetas = async (req, res, next) => {

        let results = null;

        if(!req.params.id){

            results = await models.Produtos.findAll({ 
                include : [{
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
                order : [['produtos_seco', 'id'], ['produtos_cor', 'nome']] 
            });

        }else{

            results = await models.Produtos.findByPk(req.params.id, {
                include : [{
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
                order : [['produtos_seco', 'id'], ['produtos_cor', 'nome']] 
            });

        }

        results ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addEtiquetas = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

        console.log(req.body);

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

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 3' })
        }else{

            const results = await models.Etiquetas.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar Etiquetas' })
            }

        }

    }

    module.saveEtiquetas = async (req, res, next) => {

        const Etiquetas = await models.Etiquetas.findByPk(req.params.id);

        if(Etiquetas){
            
            req.body.datecreated = new Date();

            for(key in module.fields){
                if(key != 'id'){
                    if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && (req.body[key] != null || req.body[key] != undefined)){
                        Etiquetas[key] = req.body[key];
                    }else if(!req.body[key]){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        Etiquetas[key] = req.body[key];
                    }
                }
            }

            console.log(Etiquetas);

            const results = await Etiquetas.save();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(400).json({ error : true, msg : 'Ocorreu um erro ao salvar a conta' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Registro não encontrado' });
        }

    }

    module.deleteEtiquetas = async (req, res, next) => {

        const Etiquetas = await models.Etiquetas.findByPk(req.params.id);

        if(Etiquetas){

            const results = await Etiquetas.destroy();

            if(results){
                res.json({ error : false, results });
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar' });
            }

        }else{
            res.status(500).json({ error : true, msg : 'Ocorreu um erro ao deletar 2' });
        }

    }

    module.imprimir = async (req, res, next) => {

        if(!req.body.produtos || req.body.produtos.length == 0){
            return res.notAccept('Selecione algum produto');
        }

        console.log(req.body);

        req.body.produtos.forEach((produto,i) => {
            if(parseInt(produto) == NaN){
                return res.notAccept(`O produto selecionado ${produto} não existe`)
            }else{
                req.body.produtos[i] = parseInt(produto);
            }
        })

        const results = await models.Produtos.findAll({
            where : { id : { [models.sequelize.Op.in] : req.body.produtos } }
        });
        const filename = path.join(__dirname, '..', '..', 'public', 'pdfs', `${Security.makeid(10)}.pdf`);

        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        let { pos_x, pos_y } = { pos_x : 30, pos_y : 30 };
        
        doc.pipe(fs.createWriteStream(filename));
        
        let row_int = 0;
        
        results.forEach((row, i) => {
            
            doc.font(path.join(__dirname, '..', '..', 'public', 'fonts', 'LibreBarcode39-Regular.ttf')).fontSize(30).text(row.codigo_barras, pos_x, pos_y);
            doc.font('Helvetica').fontSize(10).text(row.nome, pos_x, pos_y + 25, { width : 140, align : 'center' });
            
            //doc.font(path.join(__dirname, '..', '..', 'public', 'fonts', 'LibreBarcode39-Regular.ttf')).fontSize(30).text(row.codigo_barras, pos_x, pos_y);
            
            if(row_int == 3){
                row_int = 0;
            }

            if(row_int < 2){
                pos_x += 175;
            }else{
                pos_x = 30;
                pos_y += 45;
            }

            row_int += 1;
            
        });
        
        doc.end();

        res.json({ error : false, filename : path.basename(filename) });

    }

    router
        //.use(sec.middlewares.auth_check)
        //.use(sec.middlewares.csrf_check)
        .use(sec.responses.setResponses)
        .get('/search/:search', module.searchEtiquetas)
        .get('/:id?', module.getEtiquetas)
        .post('/imprimir', module.imprimir)
        //.post('/add', module.addEtiquetas)
        //.put('/save/:id', module.saveEtiquetas)
        //.delete('/del/:id', module.deleteEtiquetas);

    return router;

}