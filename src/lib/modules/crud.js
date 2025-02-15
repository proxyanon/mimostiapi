/**
 * @requires models
 * @requires express
 * @requires Security
 */
const models = require('./models');
const express = require('express');
const Security = require('./Security');

/**
 * @const {Security} sec
 */
const sec = new Security();

/**
 * @class
 */
class Utils {

    /**
     * @constructor
     * @param {boolean} throwException 
     */
    constructor(throwException = false){
        this.throwException = throwException;
    }

    /**
     * @method check_int
     * @param {any} value
     * @description - Verifica se realmente o valor é inteiro
     * @returns {boolean}
     */
    check_int(value){

        let check = true;

        value = typeof value == 'number' ? NaN : value;
        value = int(value) == NaN ? NaN : int(value);
        value = value <= 0 ? NaN : value;

        switch(value){

            case undefined:
            case null:
            case isNaN(value):
                check = false;
            break;

            default:
                check = true;
            break;

        }

        return check;

    }

    /**
     * @method log_error
     * @param {str} err
     * @param {str} msg
     * @description - Checa se o você quer uma exeception ou simplesmente logar o erro de uma forma quiet sem parar o servidor
     */
    log_error(err, msg){
        if(!this.throwException){
            console.clear();
            console.warn(`${msg}\n\n`);
            console.error(`Erro -> ${err}\n`);
        }else{
            throw new Error(err);
        }
    }

    /**
     * 
     * @param {express.Request} req 
     * @returns {boolean}
     */
    check_body(req){
        return Security.checkBody(req);
    }

    /**
     * @method check_fileds(fields)
     * @param {Sequelize.rawAttributes} fields 
     * @returns {boolean}
     */
    check_fields(fields){
        return Security.checkFields(fields);
    }

}

/**
 * 
 * @class
 */
class Crud extends Utils {

    /**
     * 
     * @constructor
     * @param {models.sequelize} Model
     * @param {Utils.property} throwException
     * @returns {VoidFunction}
     */
    constructor(throwException, Model){
        super(throwException);
        this.model = Model; 
    }

    /**
     * @async
     * @method threat_body_fields
     * @param {models.sequelize.rawAttributes} fields 
     * @param {express.Request.body} body 
     * @returns {object}
     */
    async threat_body_fields(fields, body){

        let record = false;

        try{
            for(key in fields){
                if(key != 'id'){
                    try{
                        if(!body[key] && this.module.fields[key].allowNull != null){
                            return { resp : { error : true, msg : `Campo(s) inválido(s) [${key}] (code: 982)`}, code : 401}
                        }else{
                            try{
                                record[key] = body[key]
                            }catch(err){
                                this.log_error(err, key);
                                return { resp : { error : true, msg : `Valor inválido para o campo ${key} (code: 22)` }, code : 401 }
                            }
                        }
                    }catch(err){
                        this.log_error(err);
                        return { resp : { error : true, msg : `Os campos não parecem ser compatíveis com o esperado (code: 1533)` }, code : 401 }
                    }
                }
            }
        }catch(err){
            this.log_error(err);
            return { resp : { error : true, msg : `Ocorreu um erro no sistema (code: 13)` }, code : 501 }
        }

        if(!record){
            return { resp : { error : true, msg : `Ouve um erro ao tratar os valores do formulário` }, code : 500 }
        }

        return record;

    }

    /**
     * @async
     * @method create
     * @param {express.Request.body} body
     * @returns {Object}
     */
    async create(body){

        let obj_create = {}
        let fields = {}

        try{
            fields = this.model.rawAttributes;
        }catch(err){
            return { resp : { error : true, msg : `Não foi possível obter os atributos para este formulário (${err})` } }
        }

        try{
            if(!this.check_body(body)){
                return { resp : { error : true, msg : 'Campos do formulário são inválido(s) ou está(ão) inválidos' }, code : 401 }
            }
        }catch(err){
            return { resp : { error : true, msg: `Erro ao verificar o formulário (${err})` }, code : 400 }
        }

        if(!this.check_fields(fields)){
            return { resp : { error : true, msg: `Atributos do formulário estão vazios` }, code : 401 }
        }

        try{
            obj_create = await this.threat_body_fields(fields, body);
        }catch(err){
            this.log_error(err)
            return { resp : { error : true, msg: `Erro ao válidar o formulário (code: 2)` }, code : 401 }
        }

        if(Object.keys(obj_create).length==0){
            this.log_error('Formulário vazio após o tratamento (code: 752)');
            return { resp : { error : true, msg : 'Formulário após o tratamento ficou vazio tente novamente (code: 752)' }, code : 401 }
        }else{

            let results = false;

            try{
                results = await record.save();
            }catch(err){
                this.log_error(err)
                return { resp : { error : true, msg : `Erro ao salvar o registro` }, code : 401 }
            }

            return results ? { resp : { error : false, obj_create : obj_create }, code : 200 } : { resp : { error : true, msg : `Ocorreu um erro ao criar o registro` }, code : 501 }

        }

    }

    async save(id, body){

        let obj_save = {}
        let fields = {}

        try{

            if(!this.check_int(id)){
                return { resp : { error : true, msg : `A identificação da unidade é inválida (code: 54)` }, code: 401 };
            }

        }catch(err){
            return { resp : { error : true, msg : `Não foi possível obter os atributos para este formulário` }, code: 501 }
        }

        try{
            fields = this.model.rawAttributes;
        }catch(err){
            this.log_error(err);
            return { resp : { error : true, msg : `Não foi possível obter os atributos para este formulário (${err})` } }
        }

        try{
            if(!this.check_body(body)){
                return { resp : { error : true, msg : 'Campos do formulário são inválido(s) ou está(ão) inválidos' }, code : 401 }
            }
        }catch(err){
            this.log_error(err)
            return { resp : { error : true, msg: `Erro ao verificar o formulário (code: 202)` }, code : 400 }
        }

        let record = false;

        try{
            record = await this.threat_body_fields(fields, body);
        }catch(err){
            this.log_error(err)
            return { resp : { error : true, msg: `Erro ao válidar o formulário (code: 2)` }, code : 401 }
        }

        try{
            record = await this.model.findByPk(int(id))
        }catch(err){
            return { resp : { error : true, msg : 'Não foi possível encontrar o registro' }, code : 404 }
        }

        if(!record){
            return { resp : { error : true, msg : 'Não foi possível encontrar o registro' }, code : 404 }
        }

        if(Object.keys(obj_save).length==0){
            return { resp : { error : true, msg : 'Campo(s) inválido(s)' }, code : 401 }
        }else{

            let results = false;

            try{
                results = await this.model.save(obj_save)
            }catch(err){
                return { resp : { error : true, msg : `Erro ao salvar o registro ${err}` }, code : 400 }
            }

            return results ? { resp : { error : false, record }, code : 200 } : { resp : { error : false, msg : 'Não foi possível salvar o registro' }, code : 501 }

        }

    }

    /**
     * @async
     * @method delete
     * @param {int} id 
     * @returns {Object}
     */
    async delete(id){

        try{

            if(!this.check_int(id)){
                this.log_error('O ID não é um inteiro');
                return { resp : { error : true, msg : `A identificação da unidade é inválida (code: 54)` }, code: 401 };
            }

        }catch(err){
            this.log_error(err);
            return { resp : { error : true, msg : `Não foi possível obter os atributos para este formulário (code: 25)` }, code: 501 }
        }

        let record = false;
        
        try{
            record = await this.model.findByPk(id);
        }catch(err){
            this.log_error(err);
            return { resp : { error : true, msg : `Registro não encontrado` }, code : 404 }
        }

        if(record){

            try{
                await record.destroy();
                return { resp : { error : false }, code : 200 }
            }catch(err){
                this.log_error(err);
                return { resp : { error : true, msg : `Erro ao excluir o registro` }, code : 401 }
            }

        }else{
            return { resp : { error : true, msg : `Não foi possível excluir o registro` }, code : 400 }
        }

    }

}

/**
 * @type {typeof Crud}
 * @type {typeof Utils}
 */
module.exports = { Crud, Utils };