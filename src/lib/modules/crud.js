/**
 * @author Daniel Victor Freire Feitosa
 * @version 2.1.1
 * @package
 * @description - Esse pacote faz CRUD de uma forma de mais alto nível
 */

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
 * @description - Essa classe fornece diversos métodos para tratar erros e fazer checagem de dados
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
     * @returns {boolean}
     * @description - Verifica se realmente o valor é inteiro
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
     * @method log_error(arguments)
     * @param {string} err
     * @param {string} msg
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
     * @method check_body
     * @param {express.Request} req 
     * @returns {Security.checkBody}
     * @description - Esse método é um alías para o método estático Security.checkBody
     */
    check_body(req){
        return Security.checkBody(req);
    }

    /**
     * @method check_fields
     * @param {this.model.rawAttributes} fields 
     * @returns {Security.checkFields}
     * @description - Esse método é um alías para o método estático Security.checkFields
     */
    check_fields(fields){
        return Security.checkFields(fields);
    }

}

/**
 * 
 * @class
 * @description - Essa clase automatiza o CRUD para os controladores
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
        this.fields = false;
        
        try{
            this.fields = this.check_fields(this.model.rawAttributes);
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, `Não foi possível obter os atributos para este formulário`, 38, 500)
        }

        if(!this.fields){
            return this.create_obj_return(true, `Não foi possível obter os atributos para este formulário`, 38, 500)
        }
        
    }

    /**
     * @method create_obj_return
     * @param {string} error 
     * @param {string} msg 
     * @param {number} code 
     * @param {number} status_code 
     * @returns {Object}
     * @description - Cria um JSON para o retorno de resposta do express
     */
    create_obj_return(error, msg, code, status_code){

        if(typeof error != 'boolean' || typeof code == 'number' || typeof status_code == 'number'){
            return { resp : { error, msg : 'Tipos de dados incompátiveis com suas definição (código do error: 1000)' }, code : 401 }
        }

        if(!this.check_int(int(code)) || !this.check_int(int(status_code))){
            return { resp : { error, msg : 'Tipos de dados incompátiveis com suas definição (código do error: 1001)' }, code : 401 }
        }

        if(code <= 0 || status_code < 200){
            return { resp : { error, msg : 'Tipos de dados incompátiveis com suas definição (código do error: 1002)' }, code : 401 }
        }

        try{
            
            if(code == 0 && status_code == 200){
                return msg.length == '' || msg == null || msg == undefined || msg == ' ' ? { resp : { error }, code : status_code } : { resp : { error, msg : `${msg} (código do error: ${code})` }, code : status_code}
            }else{
                return { resp : { error, msg : `${msg} (código do error: ${code})` }, code : status_code}
            }

        }catch(err){
            this.log_error(err);
            return { resp : { error, msg : `Não foi possível criar uma resposta para a entradas do método (código do error: 1003)` }, code : 500 }
        }

    }

    /**
     * @async
     * @method threat_body_fields
     * @param {express.Request.body} body 
     * @returns {Object}
     */
    async threat_body_fields(body){

        let record = false;

        try{
            for(key in this.fields){
                if(key != 'id'){
                    try{
                        if(!body[key] && this.fields[key].allowNull != null){
                            return this.create_obj_return(true, `Campo(s) inválido(s) [${key}]`, 982, 401)
                        }else{
                            try{
                                record[key] = body[key]
                            }catch(err){
                                this.log_error(err, key);
                                return this.create_obj_return(true, `Valor inválido para o campo ${key}`, 22, 401);
                            }
                        }
                    }catch(err){
                        this.log_error(err);
                        return this.create_obj_return(true, 'Os campos não parecem ser compatíveis com o esperado', 1533, 401);
                    }
                }
            }
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, `Ocorreu um erro no sistema`, 13, 501);
        }

        if(!record){
            return this.create_obj_return(true, 'Ouve um erro ao tratar os valores do formulário', 123, 500);
        }

        return record;

    }

    /**
     * @async
     * @method create
     * @param {express.Request.body} body
     * @returns {Object}
     * @description - Essa função cria dados no banco de dados de uma tabela especificada no construtor
     */
    async create(body){

        let obj_create = {}

        try{
            this.fields = this.model.rawAttributes;
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, 'Não foi possível obter os atributos para este formulário', 899, 500);
        }

        try{
            if(!this.check_body(body)){
                return this.create_obj_return(true, 'Campos do formulário são inválido(s) ou está(ão) inválidos', 676, 401);
            }
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, 'Erro ao verificar o formulário', 409, 400);
        }

        if(!this.check_fields(this.fields)){
            return this.create_obj_return(true, 'Atributos do formulário estão vazios', 858, 401);
        }

        try{
            obj_create = await this.threat_body_fields(body);
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, 'Erro ao válidar o formulário', 2, 401);
        }

        if(Object.keys(obj_create).length==0){
            this.log_error('Formulário vazio após o tratamento (code: 752)');
            results = this.create_obj_return(true, 'Formulário após o tratamento ficou vazio tente novamente', 752, 401);
        }else{
            results = results ? this.create_obj_return(true, record, 0, 200) : this.create_obj_return(true, `Ocorreu um erro ao criar o registro`, 778, 501)
        }

        return results;

    }

    /**
     * @async
     * @method save
     * @param {number} id 
     * @param {express.Request.body} body 
     * @returns {Object}
     * @description - Essa função salva dados no banco em uma tabela especificada no construtor
     */
    async save(id, body){

        let obj_save = {}

        try{

            if(!this.check_int(id)){
                return this.create_obj_return(true, `A identificação da unidade é inválida`, 69, 401 )
            }

        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, `Não foi possível obter os atributos para este formulário`, 911, 501)
        }

        try{
            if(!this.check_body(body)){
                return this.create_obj_return(true, 'Campos do formulário são inválido(s) ou está(ão) inválidos', 299, 401)
            }
        }catch(err){
            this.log_error(err)
            return this.create_obj_return(true, `Erro ao verificar o formulário`, 200, 400)
        }

        let record = false;

        try{
            record = await this.threat_body_fields(body);
        }catch(err){
            this.log_error(err)
            return this.create_obj_return(true, `Erro ao válidar o formulário`, 2, 401)
        }

        try{
            record = await this.model.findByPk(int(id))
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, 'Não foi possível encontrar o registro', 404, 404)
        }

        if(!record){
            this.create_obj_return(true, 'Não foi possível encontrar o registro', 404, 404)
        }

        let results = false;

        try{
            results = await this.model.save(obj_save)
        }catch(err){
            this.log_error(err);
            this.create_obj_return(true, `Erro ao salvar o registro`, 100, 400)
        }

        results = results ? this.create_obj_return(false, record, 0, 200) : this.create_obj_return(false, 'Não foi possível salvar o registro', 6969, 501)

        return results;

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
                return this.create_obj_return(false, '', 0, 200);
            }catch(err){
                this.log_error(err);
                return this.create_obj_return(true, `Erro ao excluir o registro`, 37, 401)
            }

        }else{
            return this.create_obj_return(true, `Não foi possível excluir o registro`, 1024, 400);
        }

    }

}

/**
 * @type {typeof Crud, Utils}
 */
module.exports = { Crud, Utils };