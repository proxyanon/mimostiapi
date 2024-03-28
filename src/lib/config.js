require('dotenv').config()

const path = require('path');

module.exports = {

    mysql : {

        host : 'localhost',
        user : 'root',
        password : '',
        database : 'mimostiapi'

    },

    server : {

        port : 443,

        https : {
            cert : path.join(__dirname, '../assets/server.crt'),
            key : path.join(__dirname, '../assets/server.key'),
            start_chrome : true
        },

        level_routes : [{
            name : '/app/restaurante',
            level : 1
        },{
            name : '/app/pedidos',
            level : 2
        }]

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

    isDev : true,
    verbose : true

}