const express = require('express');
const models = require('../modules/models');

const Security = require('../modules/Security');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.fields = models.Vendedores.rawAttributes

    module.searchVendedores = async (req, res, next) => {

        if(!req.params.search){ res.notAccept('Nada digitado', module.fields) };

        const { search } = req.params;
            
        const results = await models.Vendedores.findAll({ 
            where : { nome : { [ models.sequelize.Op.substring ] : search }} 
        });
        
        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.getVendedores = async (req, res, next) => {

        let results = req.params.id ? await models.Vendedores.findByPk(req.params.id) : await models.Vendedores.findAll();

        results.length > 0 ? res.json({ error : false, results, fields : Object.keys(module.fields) }) : res.status(404).json({ error : true, msg : 'Nada encontrado', fields : Object.keys(module.fields) });

    }

    module.addVendedor = async (req, res, next) => {

        let obj_create = {}

        if(Object.keys(module.fields).length!=Object.keys(module.fields).length){
            return res.status(401).json({ error : true, msg : 'Campo(s) inválido(s) 1' })
        }
        
        req.body.datecreated = new Date();

        for(key in module.fields){
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

            const results = await models.Vendedores.create(obj_create);

            if(results){
                res.json({ error : false })
            }else{
                res.status(500).json({ error : true, msg : 'Ocorreu um erro ao criar o ornecedor' })
            }

        }

    }

    module.saveVendedor = async (req, res, next) => {

        const vendedor = await models.Vendedores.findByPk(req.params.id);

        if(vendedor){
            
            vendedor['datecreated'] = new Date();

            for(key in module.fields){
                console.log(key, vendedor[key]);
                if(key != 'id' && req.body[key]){
                    if(module.fields[key].allowNull != false && vendedor[key].toString().empty()){
                        return res.status(401).json({ error : true, msg : `Preencha o campo ${key}` });
                    }else{
                        vendedor[key] = req.body[key]
                    }
                }
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
        .get('/search/:search', sec.middlewares.csrf_check, module.searchVendedores)
        .get('/:id?', sec.middlewares.csrf_check, module.getVendedores)
        .post('/add', sec.middlewares.csrf_check, module.addVendedor)
        .put('/save/:id', sec.middlewares.csrf_check, module.saveVendedor)
        .delete('/del/:id', sec.middlewares.csrf_check, module.deleteVendedor);

    return router;

}