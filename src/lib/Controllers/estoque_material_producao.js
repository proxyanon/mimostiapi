/**
 * @author Daniel Victor Freire
 * @version 2.0.0 - 2025
 * @since 2021-05-20
 * @copyright Mimos Tia Pia 2025
 * @git github.com/proxyanon/mimostiapi
 * @package src/lib/Controllers/estoque_material_producao
 * @description Controlador de estoque de material de produção
 * @see {@link module:estoque_material_producao}
 * @type {Class}
 * @implements {module:estoque_material_producao}
 */

/**
 * @requires express - Importação do módulo express	
 * @requires models - Importação do módulo models
 * @requires Security - Importação do módulo Security
 * @requires express-xss-sanitizer - Importação do módulo express-xss-sanitizer
 * @requires Crud - Importação do módulo Crud
 * @requires Utils - Importação do módulo Utils
 * @requires config - Importação do módulo config
 * 
 * @constant {express} express - Declaração da constante express
 * @constant {models} models - Declaração da constante models
 * @constant {Security} sec - Declaração da constante sec
 * @constant {express-xss-sanitizer} xss - Declaração da constante xss
 * @constant {express-xss-sanitizer} sanitize - Declaração da constante sanitize
 * @constant {Crud} crud - Declaração da constante crud
 * @constant {Utils} utils - Declaração da constante utils
 * @constant {express.Router} router - Declaração da constante router
 */

const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');
const { xss, sanitize } = require('express-xss-sanitizer');
const { Crud, Utils } = require('../modules/crud');

const sec = new Security();
const crud = new Crud(false, true, models.EstoqueMaterialProducao);
const utils = new Utils(false, true);
const router = express.Router();

const config = require('../config');

/**
 * @module estoque_material_producao - Modelo para controlar estoque de material de produção
 * @namespace estoque_material_producao  - Escopo do estoque de material de produção
 * 
 * @type {module:estoque_material_producao} - Tipo do módulo
 * @typedef {Object} module:estoque_material_producao - Definição do módulo
 * 
 * @property {Object} fields - Campos do modelo
 * @property {Function} searchEstoqueMaterialProducao - Pesquisa um registro do Estoque de material de Produção
 * @property {Function} getEstoqueMaterialProducao - Retorna um registro do Estoque de material de Produção
 * @property {Function} addEstoqueMaterialProducao - Adiciona um registro do estoque de material de Produção
 * @property {Function} saveEstoqueMaterialProducao - Salva um registro do Estoque de material de Produção
 * @property {Function} deleteEstoqueMaterialProducao - Deleta um registro do Estoque de Material de Produção
 * 
 * @param {express.Request} req - Requisição HTTPS
 * @param {express.Response} res - Resposta HTTPS
 * @param {Function} next - Próxima função a ser executada
 * 
 * @returns {express.Router} - Retorna um router
 */
module.exports = () => {

    var module = {};

    module.fields = models.EstoqueMaterialProducao.rawAttributes

    module.searchEstoqueMaterialProducao = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;

        const results = await models.EstoqueMaterialProducao.findAll({
            where : { especificao : { [ models.sequelize.Op.substring ] : search }},
            order : [['especificao', 'ASC']]
        });

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getEstoqueMaterialProducao = async (req, res, next) => {

        const results = await models.EstoqueMaterialProducao.findAll({
            include : [{
                model : models.ProdutosCor,
                required : true,
                attributes : ['id', 'nome']
            },{
                model : models.ProdutosSecoes,
                required : false,
                attributes : ['id', 'nome']
            },{
                model : models.ProdutosCategorias,
                required : false,
                attributes : ['id', 'nome']
            },{
                model : models.Unidade,
                required : false,
                attributes : ['id', 'nome'],
                as : 'u'
            }],
            order : [['especificacao', 'ASC']]
        })

        if(results){
            res.json({ error : false, results, fields : Object.keys(module.fields) })
        }else{
            res.serverError('Nada encontrado', module.fields);
        }

    }

    module.addEstoqueMaterialProducao = async (req, res, next) => {

        let obj_create = {}

        req.body.datecreated = new Date();

        req.body = sanitize(req.body);

        if(!Security.checkBody(req.body, module.fields)){
            config.verbose || config.isDev ? console.log(Object.keys(req.body), Object.keys(module.fields)) : '';
            return res.block(`[${models.EstoqueMaterialProducao.tableName.toUpperCase()}] FormulÃ¡rio nÃ£o aceito`);
        }

        for(key in module.fields){
            if(key != 'id'){
                if((module.fields[key].type == 'FLOAT' || module.fields[key].type == 'INTEGER') && module.fields[key].allowNull == false && (req.body[key] != null || req.body[key] != undefined)){
                    obj_create[key] = req.body[key]
                }else if(!req.body[key] && module.fields[key] != null){
                    return res.status(401).json({ error : true, msg : 'Campos invÃ¡lido(s) 2' })
                }else{
                    obj_create[key] = req.body[key]
                }
            }
        }

        console.log(obj_create);

        if(Object.keys(obj_create).length==0){
            res.block('Preencha o formulÃ¡rio completo');
        }else{

            const results = await models.EstoqueMaterialProducao.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o ornecedor' })
            }

        }

    }

    module.saveEstoqueMaterialProducao = async (req, res, next) => {

        const estoque_material_producao = await models.EstoqueMaterialProducao.findByPk(req.params.id)

        if(estoque_material_producao){

            estoque_material_producao['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, estoque_material_producao[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull == false && estoque_material_producao[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        estoque_material_producao[key] = req.body[key]
                    }
                }
            }

            if((parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida'])) <= 0){
                return res.block('O estoque nÃ£o pode ser menor que zero digite uma saÃ­da menor ou uma entrada maior');
            }

            if((parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida'])) <= estoque_material_producao['entrada']){
                return res.block('A saÃ­da nÃ£o pode ser maior que a entrada');
            }

            estoque_material_producao['estoque'] = parseInt(estoque_material_producao['entrada']) - parseInt(estoque_material_producao['saida']);

            const results = await estoque_material_producao.save();

            if(results){
                res.json({ error : false, results })
            }else{
                res.block('Ocorreu um erro ao salvar o estoque');
            }

        }else{
            res.serverError('Estoque nÃ£o encontrado')
        }

    }

    /**
     * @property {Function} deleteEstoqueMaterialProducao
     * @param {express.Request} const
     * @param {express.Response} res
     * @returns {Promise<express.Response>}
     * @async
     * @method
     * @public
     * @version 1.0.0
     * @description Deleta um estoque de material de produção
     * @summary Deleta um estoque de material de produção
     * @see {@link module:estoque_material_producao}
     */
    module.deleteEstoqueMaterialProducao = async (req, res, next) => {

        const estoque_material_producao = await models.EstoqueMaterialProducao.findByPk(req.params.id);

        if(estoque_material_producao){

            const results = await estoque_material_producao.destroy();
            res.json({ error : false, results });

        }else{
            res.serverError('Ocorreu um erro ao deletar');
        }

    }

    module.getEstoqueMaterialProducaoUnidade = async (req, res, next) => {

        results = req.params.id ? await crud.read(req.params.id) : await crud.read();

        return results;

    }

    /**
     * @async
     * @property {Function} addEstoqueMaterialProducaoUnidade
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {Function} next 
     * @returns {Promise<express.Response>}
     * @version 1.0.0
     * @description Adiciona um estoque de material de produção a uma unidade
     * @summary Adiciona um estoque de material de produção a uma unidade
     * @see {@link module:estoque_material_producao}
     * @public
     * @method
     * @example
     * addEstoqueMaterialProducaoUnidade(req, res, next)
     * @async
     * @throws {Error} Se ocorrer um erro na execução da tarefa
     */
    module.addEstoqueMaterialProducaoUnidade = async (req, res, next) => {
            
            /**
             * @var {*} results
             * @var {boolean} check_body
             */
            let results = false;
            let check_body;
            
            try{
                check_body = utils.check_body(req);
            }catch(err){
                return res.notAccept('Não foi possível checar os valores do formulário');
            }

            if(check_body.resp.error){
                return res.notAccept('Não foi possível checar os valores do formulário');
            }

            try{
                results = await utils.create(req.body);
            }catch(err){
                utils.log_error(err);
                return res.notAccept('Ocorreu na execução a tarefa');
            }

            if(!results){
                return res.notAccept('Ocorreu na execução');
            }

            try{
                return res.json({ results, error : false });
            }catch(err){
                crud.log_error(err);
                return res.notAccept('Requisição mal formatada');
            }
    
        }

        module.saveEstoqueMaterialProducaoUnidade = async (req, res, next) => {
            
            /**
             * @var {*} results
             * @var {boolean} check_body
             */
            let results = false;
            let check_body;
            
            try{
                check_body = utils.check_body(req);
            }catch(err){
                crud.log_error(err);
                return res.notAccept('Não foi possível checar os valores do formulário');
            }

            if(check_body.resp.error){
                return res.notAccept('Não foi possível checar os valores do formulário');
            }

            try{
                results = await crud.save(req.params.id, req.body);
            }catch(err){
                crud.log_error(err);
                return res.notAccept(`Ocorreu na execução da tarefa`);
            }

            if(!results){
                return res.notAccept(`Ocorreu na execução`);
            }

            try{
                return crud.create_obj_return(false, '', 0, 200);
            }catch(err){
                crud.log_error(err);
                return res.badRequest('');
            }
    
        }

        /**
         * @property {Function} delEstoqueMaterialProducaoUnidade
         * @param {express.Request} req
         * @param {express.Response} res
         * @returns {Promise<express.Response>}
         */
        module.delEstoqueMaterialProducaoUnidade = async (req, res, next) => {
            
            /**
             * @var {*} results
             */
            let results = false;

            

            try{
                results = await crud.delete(req.params.id);
            }catch(err){
                return res.status(500).json({ error : true, msg : `Ocorreu na execução da tarefa (${err})` });
            }

            if(!results){
                return res.status(500).json({ error : true, msg : `Ocorreu na execução` });
            }

            try{
                return res.status(results.code).json({ error : results.resp.error, msg : results.resp.msg });
            }catch(err){
                return res.status(400).json({ error : true, msg : `Malformated request (${err})` });
            }
    
        }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        //.use(xss())
        //.use(sec.middlewares.sanitize_body)
        .get('/search/:search', module.searchEstoqueMaterialProducao)
        .get('/:id?', module.getEstoqueMaterialProducao)
        .get('/unidade/:id?', module.getEstoqueMaterialProducaoUnidade)
        .put('/save/:id',  module.saveEstoqueMaterialProducao)
        .delete('/del/:id', module.deleteEstoqueMaterialProducao)
        .post('/unidade/add',  module.addEstoqueMaterialProducaoUnidade)
        .put('/unidade/save/:id',  module.saveEstoqueMaterialProducaoUnidade)
        .delete('/unidade/del/:id',  module.delEstoqueMaterialProducaoUnidade)
        .post('/add', module.addEstoqueMaterialProducao);

    return router;

}