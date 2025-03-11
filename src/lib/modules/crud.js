/**
 * @author Daniel Victor Freire Feitosa
 * @version 1.0.0
 * @since 2021-03-12
 * @name crud.js
 * @package lib/modules
 * @module {Crud, Utils} - Módulo de CRUD e Utils
 * @description - Esse pacote faz o CRUD de uma forma de mais alto nível
 * @requires {models, express, Security} - Módulos de modelos, express e segurança
 * @copyright 2021-2025
 * @license MIT
 * @see {@link https://github.com/proxyanon/mimostiapi} - GitHub do projeto Mimos tia Pi API
 * @example - const { Crud, Utils } = require('./lib/modules/crud');
 */

// Importações de módulos e pacotes necessários para o funcionamento do módulo de CRUD e Utils

/**
 * @constant {models} models - Importa os modelos do banco de dados para o módulo de CRUD e Utils
 * @constant {express} express - Importa o express para o módulo de CRUD e Utils
 * @constant {Security} Security - Importa a classe Security para o módulo de CRUD e Utils
 */

const models = require('./models'); // Importa os modelos do banco de dados para o módulo de CRUD e Utils
const express = require('express'); // Importa o express para o módulo de CRUD e Utils
const Security = require('./Security'); // Importa a classe Security para o módulo de CRUD e Utils

/**
 * @constant {Security} sec - Instância da classe Security
 * @description - Instância da classe Security
 */
const sec = new Security(); // Instância da classe Security

/**
 * @class Utils
 * @classdesc - Essa classe fornece diversos métodos para tratar erros e fazer checagem de dados,
 * verifica números para saber se são inteiros, faz log de erros no console levando em conta se
 * você quer user verbose ou então pode disparar um evento throwException no paramêtro de mesmo nome
 */
class Utils {

    /**
     * @typedef {(number | string)} IntString - Número ou string
     * @typedef {express.Request} Request - Requisição do express
     * @typedef {express.Response} Response - Resposta do express
     * @typedef {express.Request.body} RequestBody - Corpo da requisição
     * @typedef {express.Request.params} RequestParams - Parâmetros da requisição
     * @typedef {(express.Request.params.property | number)} RequestParamProperty - Propriedade dos parâmetros da requisição
     * @typedef {Security.checkFields} CheckFields - Checa os campos
     * @typedef {Utils.property} UtilsProperty - Propriedades da classe Utils
     * @typedef {Security.CheckFields} SecurityCheckBody - Checa o corpo da requisição
     * 
     */

    /**
     * @constructor - Construtor da classe Utils
     * @this Crud - Acesso a classe Crud
     * 
     * @typedef {this.model.rawAttributes} Fields - Atributos da tabela
     * @typedef {ClassAccessorDecoratorContext.Utils.property} UtilsProperty - Propriedades da classe Utils
     * 
     * @param {boolean} throwException - true/false
     * @param {boolean} verbose - true/false
     * 
     * @description - Construtor recebe os paramêtros de throException e verbose
     * @example - const utils = new Utils(true, false);
     * 
     * @returns {Utils} - Retorna uma instância de Utils
     */
    
    constructor(throwException = false, verbose = true){
        this.throwException = throwException;
        this.verbose = verbose;
    }

    /**
     * @method check_int - Verifica se o valor é inteiro
     * @description - Verifica se realmente o valor é inteiro
     * @param {(number | string)} value - Valor a ser verificado
     * @example - utils.check_int(1) // true
     * @example - utils.check_int('1') // true
     * @example - utils.check_int('1.0') // false
     * @example - utils.check_int(1.0) // false
     * @example - utils.check_int('1.0') // false
     * @returns {boolean} - Retorna true se for inteiro e false se não for
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
     * @method log_error - Loga o erro no console e retorna uma exceção ou não dependendo do valor de throwException e verbose no construtor da classe Utils
     * @param {Error} err - Erro a ser logado no console e tratado de acordo com o valor de throwException e verbose no construtor da classe Utils
     * @param {string} msg - Mensagem a ser logada no console e tratada de acordo com o valor de throwException e verbose no construtor da classe Utils
     * 
     * @description - Checa se o você quer uma exeception ou simplesmente logar o erro de uma forma quiet sem parar o servidor
     * 
     * @example - utils.log_error('Erro ao fazer a requisição', 'Erro ao fazer a requisição')
     * @example - utils.log_error('Erro ao fazer a requisição', 'Erro ao fazer a requisição', true)
     * @example - utils.log_error('Erro ao fazer a requisição', 'Erro ao fazer a requisição', false)
     * 
     * @throws {Error} - Se throwException for true e verbose for true ele vai parar o servidor e mostrar o erro no console e no navegador do usuário que fez a requisição e se verbose for false ele vai mostrar o erro no console e não vai parar o servidor e se throwException for false ele vai mostrar o erro no console e não vai parar o servidor e se verbose for true ele vai mostrar o erro no console e não vai parar o servidor e se verbose for false ele vai mostrar o erro no console e não vai parar o servidor e se throwException for true ele vai parar o servidor e mostrar o erro no console e no navegador do usuário que fez a requisição e se throwException for false ele vai mostrar o erro no console e não vai parar o servidor e se verbose for true ele vai mostrar o erro no console e não vai parar o servidor e se verbose for false ele vai mostrar o erro no console e não vai parar o servidor
     * @returns {void} - Retorna void (vazio)
     */
    log_error(err, msg){
        console.error(err, msg);
        if(!this.throwException && this.verbose){
            console.clear();
            console.warn(`${msg}\n\n`);
            console.error(`Erro -> ${err}\n`);
        }else{
            throw new Error(err);
        }
    }

    /**
     * @alias Security.checkBody - Checa o corpo da requisição
     * @method check_body - Checa o corpo da requisição
     * @description - Checa o corpo da requisição do express e retorna um objeto com os campos checados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @param {express.Request} req - Requisição do express
     * @returns {SecurityCheckBody} - Retorna um objeto com os campos checados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     */
    check_body(req){
        return Security.checkBody(req);
    }

    /**
     * @alias Security.checkFields - Checa os campos da tabela do banco de dados para o formulário do express
     * @method check_fields - Checa os campos da tabela do banco de dados para o formulário do express
     * @this Crud - Acesso a classe Crud
     * @param {Fields} fields - Atributos da tabela do banco de dados para o formulário do express
     * @returns {CheckFields} - Retorna um objeto com os campos checados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @example - const fields = utils.check_fields(fields);
     * @example - const fields = utils.check_fields(this.model.rawAttributes);
     * @description - Esse método é um alías para o método estático Security.checkFields
     */
    check_fields(fields){
        return Security.checkFields(fields);
    }

}

/**
 * 
 * @class
 * @classdesc - Essa classe automatiza o CRUD para os controladores do express
 * @extends Utils
 */
class Crud extends Utils {

    /**
     * 
     * @constructor - Construtor da classe Crud que herda de Utils
     * @this Crud - Acesso a classe Crud
     * @param {UtilsProperty} throwException - true/false
     * @param {UtilsProperty} verbose - true/false
     * @param {models} Model - Modelo do banco de dados que será usado para o CRUD
     * @returns {Crud} - Retorna uma instância de Crud
     */
    constructor(throwException, verbose, Model){
        
        super(throwException, verbose);
        
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
     * @method create_obj_return - Cria um objeto de retorno para o express com um JSON
     * @description - Cria um JSON para o retorno de resposta do express
     * @param {boolean} error - true/false
     * @param {string} msg - Mensagem de retorno
     * @param {number} code - Código do erro
     * @param {number} status_code  - STATUS_CODE de resposta
     * @returns {Object} - Retorna um objeto com os valores passados
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
     * @async {promise} - Retorna uma promessa de uma função assíncrona que trata os campos do corpo da requisição do express e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @param {express.RequestBody} body - Corpo da requisição do express
     * @returns {Object} - Retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @description - Essa função trata os campos do corpo da requisição do express e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @example - const record = await this.threat_body_fields(body);
     * @example - const record = await this.threat_body_fields(req.body);
     * @method threat_body_fields - Trata os campos do corpo da requisição
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
                            
                            let type_value = typeof body[key];

                            type_value = type_value == 'number' ? 'INTEGER'.toLocaleLowerCase() : type_value;

                            if(`${format(this.module.type)}`.split('.')[1].toLowerCase() != type_value){
                                return this.create_obj_return(true, `Formato inválido para o campo ${key}`, 15, 403);
                            }

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
     * @async {promise} - Retorna uma promessa de uma função assíncrona que lê dados no banco de dados de uma tabela especificada no construtor
     * @method read - Lê dados no banco de dados de uma tabela especificada no construtor e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @description - Essa função lê dados no banco de dados de uma tabela especificada no construtor
     * @param {IntString} id - Identificação da unidade a ser lida no banco de dados do express ou do express em si 
     * @example - const record = await this.read(1);
     * @returns {Object} - Retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     */
    async read(id=false) {

        let hashId = id ? 'sim' : 'não';

        console.info('Entrou na funcao read');
        console.info(`Tem id ? ${hashId}`.format(id));

        if(id){
            id = int(id);

            if(!this.check_int(id)){
                return this.create_obj_return(true, 'Para especificar um registro você deve passa-lo como inteiro...');
            }
        }

        let record = false;

        try{

            record = id ? await this.model.findByPk(int(id)) : await this.model.findAll({});

        }catch(err){
            this.log_error(err);
            this.create_obj_return(true, 'Ocorreu um erro ao buscar os dados das unidades...', 1, 404);
        }

        const reults =  record ? this.create_obj_return(false, 'Sucess', 0, 200) : this.create_obj_return(true, 'Não foi possível encontra nenhum registro(s)', 888, 404);

        return results;

    }

    /**
     * @async {promise} - Retorna uma promessa de uma função assíncrona que cria dados no banco de dados de uma tabela especificada no construtor e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @method create - Cria dados no banco de dados de uma tabela especificada no construtor
     * @description - Essa função cria dados no banco de dados de uma tabela especificada no construtor
     * @param {express.RequestBody} body - Corpo da requisição do express
     * @returns {Object} - Retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @example - const record = await this.create(body);
     * @example - const record = await this.create(req.body);
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
     * @async {promise} - Retorna uma promessa de uma função assíncrona que atualiza dados no banco em uma tabela especificada no construtor e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express    * @method save - Salva dados no banco em uma tabela especificada no construtor
     * @description - Essa função salva dados no banco em uma tabela especificada no construtor
     * @param {(number | express.RequestParamProperty)} id - Identificação da unidade a ser atualizada no banco de dados do express ou do express em si
     * @param {(Object | express.RequestBody)} body - Corpo da requisição do express ou um objeto
     * @example - const record = await this.save(1, body);
     * @example - const record = await this.save(1, req.body);
     * @returns {Object} - Retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
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
     * @async {promise} - Retorna uma promessa de uma função assíncrona que deleta um registro no banco de dados de uma tabela especificada no construtor e retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     * @method delete - Deleta um registro no banco de dados de uma tabela especificada no construtor
     * @description - Esse método deleta um registro, atenção é indicado que seja feito backup antes de qualquer uso do metódo
     * @param {(number | express.RequestParamProperty)} id - Identificação da unidade a ser deletada no banco de dados do express ou do express em si
     * @example - const record = await this.delete(1);
     * @returns {Object} - Retorna um objeto com os campos tratados ou um objeto de erro com a mensagem de erro e o código do erro e o status_code da resposta do express
     */
    async delete(id){

        try{

            if(!this.check_int(id)){
                this.log_error('O ID não é um inteiro');
                return this.create_obj_return(true, `A identificação da unidade é inválida`, 54, 401)
            }

        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, `Não foi possível obter os atributos para este formulário`, 25, 501);
        }

        let record = false;
        
        try{
            record = await this.model.findByPk(id);
        }catch(err){
            this.log_error(err);
            return this.create_obj_return(true, `Registro não encontrado`, 911, 404);
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
 * @type {typeof Crud, Utils} - Exporta a classe Crud e Utils para serem usadas em outros módulos do projeto Mimos tia Pi API
 */
module.exports = { Crud, Utils }; // Exporta a classe Crud e Utils para serem usadas em outros módulos do projeto Mimos tia Pi API