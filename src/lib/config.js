require('dotenv').config()

const path = require('path');

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

        hostname : 'mimostiapi.io',
        port : 443,
        start_chrome : false,
        use_https : true,

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
        }

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

    isDev : true,
    verbose : true

}