/**
 * @author Daniel Victor Freire Feitosa
 * @version 0.0.2
 * @package config
 * @file config.js
 * @date 30/05/2025
 * @since 2024
 * @description - CRUD easily with crud.js automatize and coding in new layer of high level compared to only ORM, and get incress in produtivicty
 * @access {private}
 * @github https://github.com/proxyanon/mimostiapi
 */

/**
 * @requires {dotenv} - import ambient vars
 * @requires {path} - import pa th for koad certificates
 * @description - Just imports 
 */ 
require('dotenv').config();

const path = require('path');
const autoBackup = require('./modules/autoBackup');
const { dmy, hms } = autoBackup.getDateTime();

/**
 * @const {config} module - Configurarações do servidor
 * @description - Engloba toda a configuração do servidor incluido banco de dados, sockete mais coiasas criticas
 * 
 * @property {mysql} Object - Configuraçao do database
 *   @property || @param {mysql.host} str - Host of database
 *   @property || @param {mysql.user} str - User of database
 *   @property || @param {mysql.password} str - Password of database
 *   @property || @param {mysql.database} str - Database of database
 * 
 * @property {colors} Object - Configuraçao de cores
 *   @property {colors.reset} str - Códificação de cor
 *   @property {colors.bright} str - Códificação de cor
 *   @property {colors.underline} str - Códificação de cor
 *   @property {colors.fg} Object - Configuraçao de cores
 *   @property {colors.fg.yellow} - Códificação de cor
 *   @property {colors.fg.red} - Códificação de cor
 *   @property {colors.fg.green} - Códificação de cor
 * 
 * @property {colors.bg} Object - Configuraçao de cores
 *    @property {colors.bg.yellow} - Códificação de cor
 *    @property {colors.bg.red} - Códificação de cor
 *    @property {colors.bg.green} - Códificação de cor
 *    @property {colors.bg.yellow} - Códificação de cor
 *    @property {colors.bg.blue} - Códificação de cor
 * 
 * @property {server} Object - Configuraçao do server
 *   @property {server.port} int - Port of server
 *   @property {server.host} str - Host of server
 *   @property {start_chrome} bool - If true, start chrome with mimostiapi.io
 *   
 *   @summary - SSL configurations - Check if server is using ssl 
 *     @property {server.use_ssl} bool - Check if 
 *     @property {server.ssl.key} str - Key of server
 *     @property {server.ssl.cert} str - Cert of serverserver
 *     @property {server.ssl.rejectUnauthorized}
 */

const APP_VERSION = process.env.MIMOS_VERSION || '2.1.7';

const config = module.exports = {

    version : APP_VERSION,

    mysql : {

        host : process.env.DB_HOST || 'localhost',
        user : process.env.DB_USER || 'root',
        password : process.env.DB_PASS || '',
        database : process.env.DB_NAME|| 'mimostiapi',
        port: process.env.DB_PORT || 3306,
        backup_path : process.env.DB_BACKUP_PATH || path.join(__dirname, '..', '.mariadb_bkp'),
        backup_filename : process.env.DB_BACKUP_FILE || `mimostiapi_${APP_VERSION}_backup_${dmy}_${hms}_${(new Date).toTimeString()}.sql`,
    },

    colors : {
        reset : '\x1b[0m',
        bright : '\x1b[1m',
        blink : '\x1b[5m',
        dim : '\x1b[2m',
        underscore : '\x1b[4m',
        fg : {
            yellow : '\x1b[33m',
            red : '\x1b[31m',
            cyan : '\x1b[36m',
            blue : '\x1b[34m',
            green : '\x1b[32m'
        },
        bg : {
            white : '\x1b[47m',
            black : '\x1b[40m'
        }
    },

    server : {

        hostname: process.env.SERVER_HOST || 'mimostiapi.io',
        port : process.env.SERVER_PORT || 443,
        start_chrome : process.env.SERVER_START_CHROME ||true,
        use_https : process.env.SERVER_USE_HTTPS ||true,

        https : {
            cert : null || path.join(__dirname, '../assets/newcert/test/mimostiapi.io.crt'),
            key : null || path.join(__dirname, '../assets/newcert/test/mimostiapi.io.key')
            //cert : path.join(__dirname, '../assets/server.crt'),
            //key : path.join(__dirname, '../assets/server.key')
        },

        level_routes : [{
            name : '/app/restaurante',
            level : 1
        },{
            name : '/app/pedidos',
            level : 2
        }],

        trust_proxy : process.env.TRUSTY_PROXY || 1,
        
        session : {
            secret : process.env.SESSION_SECRET || 'session',
            proxy : process.env.SESSION_USE_PROXY || true,
            cookie : {
                secure : process.env.SESSION_SECURE_HEADER || true,
                maxAge : process.env.SESSION_COOKIE_MAX_AGE || 60000 * 60 * 24 // 24 horas
            },
            resave : process.env.SESSION_RESAVE_SESSION || false,
            saveUninitialized : process.env.SESSION_SAVE_AFK || true,
        },

        throwException : process.env.THROW_EXCEPTIONS || false

    },

    session : {
        name : process.env.SESSION_NAME || 'session',
        keys : [process.env.SESSION_SECRET] || ['MY-SUPER-SECRET-TOKEN'],
        secure : process.env.SESSION_SECURE || true,
        httpOnly : process.env.SESSION_COOKIE_HTTPONLY || true,
        overwrite : process.env.SESSION_SECURE_OVERWRITE || false,
        maxAge : process.env.SESSION_MAX_AGR || 24 * 60 * 60 * 1000 // 1dia
    },

    tokens : {
        jwt : {
            secret : process.env.JWT_SECRET || 'MY-SUPER-SECRET-TOKEN'
        },
        csrf : {
            required : process.env.JWT_CSRF_REQUIRED | false,
            size : process.env.JWT_CSRF_TOKEN_SIZE | 35,
            header : process.env.JWT_HEAEDER_NAME || 'X-CSRF-TOKEN'.toLowerCase()
        }
    },

    uploads : {

        accepted_ext : ['.png', '.jpg', '.jpeg'],
        accepted_mime_types : ['image/jpeg', 'image/png', 'image/jpg'],
        upload_path : path.join(__dirname, '..', 'public', 'files'),
        max_file_size : process.env.UPDLOADS_MAXSIZE || 1024 * 1024 * 5,
        max_files : process.env.UPLOADS_MAX_FILES || 1

    },

    install_deps : {
        run_app_after_check : process.env.INSTALL_DEPS || false,
        auto_install : process.env.INSTALL_DEPS_FORCE || true
    },

    logs : {
        filename : process.env.LOGS_FILENAME_PATTERN || `mimos_backup_${dmy}_${hms}_${(new Date).toString()}.log`
    },

    numeric : {
        max_float_digits : 2
    },

    isDev : process.env.IS_DEV || true,
    verbose : process.env.VERBOSE || true

}