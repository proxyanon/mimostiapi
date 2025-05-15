require('dotenv').config()

const path = require('path');

/**
 * @const {config} module - Configurarações do servidor
 * @description - Engloba toda a configuração do servidor incluido banco de dados, sockete mais coiasas criticas
 * 
 * @property {mysql} Object - Configuraçao do database
 *   @property {mysql.host} str - Host of database
 *   @property {mysql.user} str - User of database
 *   @property {mysql.password} str - Password of database
 *   @property {mysql.database} str - Database of database
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
     @property {start_chrome} bool - If true, start chrome with mimostiapi.io
 *   
 *   @summary - SSL configurations - Check if server is using ssl 
 *     @property {server.use_ssl} bool - Check if 
 *     @property {server.ssl.key} str - Key of server
 *     @property {server.ssl.cert} str - Cert of serverserver
 *     @property {server.ssl.rejectUnauthorized}
 */
const config = module.exports = {

    mysql : {

        host : 'localhost',
        user : 'root',
        password : '',
        database : 'mimostiapi'

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

        hostname: 'mimostiapi.io',
        port : 80,
        start_chrome : true,
        use_https : false,

        https : {
            cert : path.join(__dirname, '../assets/newcert/test/mimostiapi.io.crt'),
            key : path.join(__dirname, '../assets/newcert/test/mimostiapi.io.key')
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

        trust_proxy : 1,
        
        session : {
            secret : 'session',
            proxy : true,
            cookie : {
                secure : true,
                maxAge : 60000 * 60 * 24 // 24 horas
            },
            resave : false,
            saveUninitialized : true,
        },

        throwException : false

    },

    session : {
        name : 'session',
        keys : ['MY-SUPER-SECRET-TOKEN'],
        secure : true,
        httpOnly : true,
        overwrite : false,
        maxAge : 24 * 60 * 60 * 1000 // 1dia
    },

    tokens : {
        jwt : {
            secret : 'MY-SUPER-SECRET-TOKEN'
        },
        csrf : {
            required : false,
            size : 35,
            header : 'X-CSRF-TOKEN'.toLowerCase()
        }
    },

    uploads : {

        accepted_ext : ['.png', '.jpg', '.jpeg'],
        accepted_mime_types : ['image/jpeg', 'image/png', 'image/jpg'],
        upload_path : path.join(__dirname, '..', 'public', 'files'),
        max_file_size : 1024 * 1024 * 5,
        max_files : 1

    },

    install_deps : {
        run_app_after_check : false,
        auto_install : true
    },

    logs : {
        filename : 'mimostiapi.log'
    },

    numeric : {
        max_float_digits : 2
    },

    isDev : true,
    verbose : true

}
