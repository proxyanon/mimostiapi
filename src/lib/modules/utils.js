/**
 * @requires models
 * @requires express
 * @requires Security
 */
const models = require('../modules/models');
const express = require('express');
const Security = require('../modules/Security');

/**
 * @const {Security} sec
 */
const sec = new Security();

/**
 * 
 * @class
 */
class Utils {

    /**
     * 
     * @constructor
     * @param {models.sequelize} Model
     */
    constructor(Model){
        this.model = Model;
    }

    /**
     * @async
     * @method add_save
     * @param {str} body
     * @param {str} type
     * @returns {Object}
     */
    async add_save(body, type='add'){

        if(typeof type != 'string' || !type){
            return { resp : { error : true, msg : `O tipo de CRUD não é uma string ou é inválido` }, code : 401 }
        }

        try{
            type = type.toLowerCase();
        }catch(err){
            return { resp : { error : true, msg : `O tipo é inválido (${err})` }, code : 401 }
        }

        let types = ['add', 'a', 'save', 's']

        let obj_create = {}
        let fields = {}

        if(!types.includes(type)){
            return { resp : { error : true, msg : `O tipo de CRUD não existe` }, code : 401 }
        }

        try{
            fields = this.model.rawAttributes;
        }catch(err){
            return { resp : { error : true, msg : `Não foi possível obter os atributos para este formulário (${err})` } }
        }

        try{
            if(!sec.checkBody(body)){
                return { resp : { error : true, msg : 'Campos do formulário são inválido(s) ou está(ão) inválidos' }, code : 401 }
            }
        }catch(err){
            return { resp : { error : true, msg: `Erro ao verificar o formulário (${err})` }, code : 400 }
        }

        if(Object.keys(fields).length <= 0){
            return { resp : { error : true, msg: `Atributos do formulário estão vazios` }, code : 401 }
        }

        for(key in fields){
            if(key != 'id'){
                if(!body[key] && this.module.fields[key].allowNull != null){
                    return { resp : { error : true, msg : `Campo(s) inválido(s) [${key}]`}, code : 401}
                }else{
                    obj_create[key] = body[key]
                }
            }
        }

        if(Object.keys(obj_create).length==0){
            return { resp : { error : true, msg : 'Campo(s) inválido(s)' }, code : 401 }
        }else{

            let results = false;

            try{
                
                switch(type){
                    case 'add', 'a': results = await this.model.create(obj_create); break;
                    case 'save', 's': results = await this.model.save(obj_create); break;
                }
                
            }catch(err){
                return { resp : { error : true, msg : `Erro ao ${ type == 'add' || type == 'a' ? 'criar' : type == 'save' || type == 's' ? 'salvar' : results = false } registro ${err}` } }
            }

            if(results){
                return { resp : { error : false, obj_create : obj_create }, code : 200 }
            }else{
                return { resp : { error : true, msg : `Ocorreu um erro ao ${ type == 'add' || type == 'a' ? 'criar' : type == 'save' || type == 's' ? 'salvar' : results = false } o registro` } , code : 500 }
            }

        }

    }

    /**
     * @async
     * @method del
     * @param {int} id 
     * @returns {Object}
     */
    async del(id){

        let record = false;
        
        try{
            record = await this.model.findByPk(id);
        }catch(err){
            return { resp : { error : true, msg : `Registro não encontrado` }, code : 404 }
        }

        if(record){

            try{
                await record.destroy();
                return { resp : { error : false }, code : 200 }
            }catch(err){
                return { resp : { error : true, msg : `Erro ao excluir o registro` }, code : 401 }
            }

        }else{
            return { resp : { error : true, msg : `Não foi possível excluir o registro` }, code : 400 }
        }

    }

}

/**
 * @type {typeof Utils}
 */
module.exports = Utils;