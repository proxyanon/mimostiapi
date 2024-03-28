const express = require('express'),
    app = express(),
    config = require('./lib/config'),
    { handleParams } = require('./lib/modules/Security'),
    { createServer } = require('https'),
    sequelize = require('sequelize'),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    session = cookieSession(config.session),
    cors = require('cors'),
    helmet = require('helmet'),
    path = require('path'),
    fs = require('fs'),
    { Server } = require('socket.io'),
    routes = require('./lib/modules/routes'),
    compression = require('compression'),
    BarcodeScanner = require('native-barcode-scanner'),
    util = require('util'),
    { exec } = require('child_process');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
    contentSecurityPolicy : false
}));
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

const https_server = createServer({
    cert : fs.readFileSync(config.server.https.cert),
    key : fs.readFileSync(config.server.https.key),
    rejectUnauthorized : true
}, app);

const io = new Server(https_server);
const scanner = new BarcodeScanner({});

(async () => {

    const db = require('./lib/modules/database');

    try{
        await db.sync();
    }catch(err){
        throw err;
    }

    app.use(handleParams);

    app.set('socket-io', io);
    app.set('trust proxy', 1);
    app.use(session);

    // views routes
    app.use('/', routes.index);
    app.use('/app', routes.app);

    // api routes
    app.use('/api/v1/usuarios', routes.usuarios);
    app.use('/api/v1/clientes', routes.clientes);
    app.use('/api/v1/fornecedores', routes.fornecedores);
    app.use('/api/v1/vendedores', routes.vendedores);
    app.use('/api/v1/prestadores_servicos', routes.prestadores_servicos);
    app.use('/api/v1/funcionarios', routes.funcionarios);
    app.use('/api/v1/produtos', routes.produtos);
    app.use('/api/v1/estoque_material_producao', routes.estoque_material_producao);
    app.use('/api/v1/estoque_produto_final', routes.estoque_produto_final);
    app.use('/api/v1/caixa', routes.caixa);
    app.use('/api/v1/formas_pagamentos', routes.formas_pagamentos);
    app.use('/api/v1/contas_pagar', routes.contas_pagar);
    app.use('/api/v1/contas_receber', routes.contas_receber);
    app.use('/api/v1/relatorios', routes.relatorios);

    https_server.listen(config.server.port, () => {
        
        config.isDev || config.verbose ? console.log('[+] Server listening on', config.server.port) : '';

        async function start_chrome(){
            const { stdout, stderr } = await exec('start chrome.exe https://localhost');
        }

        config.server.start_chrome ? start_chrome() : console.log('chrome not started automatily');

    })

    io.on('connection', socket => {

        console.log('Connected from' + socket.id);

        socket.join(socket.id);

        scanner.on('code', code => {
            //console.log(code);
            socket.emit('codigo_barras', code);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected', socket.id);
            //scanner.off();
        })

    });

})();