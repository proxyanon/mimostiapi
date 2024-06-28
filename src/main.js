/**
 * @author Daniel Victor Freire Freire
 * @version 1.2.0
 * @copyright mimostiapi
 * @license MIT
 * @namespace main
 * @package main.js
 */

const Security = require('./lib/modules/Security');

// MAIN IMPORTS
const express = require('express'),
    app = express(),
    config = require('./lib/config'), // app config
    { handleParams } = require('./lib/modules/Security'), // Handle params to prevent error responses
    http_ = require('http'), // http server
    https_ = require('https'), // https server
    sequelize = require('sequelize'),
    cookieParser = require('cookie-parser'), // manage cookie middlewares
    //session = cookieSession(config.session),
    session = require('express-session'), // manage sessions middlewares
    cors = require('cors'), // remove errors in api requests
    helmet = require('helmet'),
    path = require('path'),
    fs = require('fs'),
    { Server } = require('socket.io'), // socket.io
    routes = require('./lib/modules/routes'), // api routes
    compression = require('compression'), // compress requests to upgrade peformance
    BarcodeScanner = require('native-barcode-scanner'), // scanner barcodes
    PDFDocument = require('pdfkit'), // PDF creation
    { xss } = require('express-xss-sanitizer'), // XSS middleware
    { exec } = require('child_process'); // exec to start chrome

app.set('view engine', 'ejs'); // SET VIEW ENGINE IN THIS CASE EJS
app.set('views', path.join(__dirname, 'views')); // VIEWS PATH

// CONFIG HEADERS TO HANDLE CLIENT REQUESTS
app.use(helmet({ contentSecurityPolicy : false }));
app.use(cors()); // remove mutiple errors in api requests
app.use(xss()); // xss prevent
app.use(compression()); // compress request to performance
app.use(cookieParser()); // session manegment
app.use(express.urlencoded({ extended : true })); // set accept only JSON requests
app.use(express.json()); // set to accept only JSON requets

app.use('/public', express.static(path.join(__dirname, 'public'))); // Static route for folder src/public

let server = null;

// Trying to create http or https server if https try to use certificates
try{
    server = config.server.use_https ? https_.createServer({ cert : fs.readFileSync(config.server.https.cert), key : fs.readFileSync(config.server.https.key), rejectUnauthorized : true }, app) : http_.createServer(app); // Server HTTP or HTTPS
}catch(err){
    throw err;
}

const io = new Server(server); // socket.io service attached
const scanner = new BarcodeScanner({}); // Barcode scanner class

(async () => {

    const db = require('./lib/modules/database'); // Database instance

    // Try to sync database
    try{
        await db.sync();
    }catch(err){
        throw err;
    }

    //config.server.start_chrome = config.isDev ? false : true;
    config.server.session.cookie.secure = config.server.use_https ? true : false;
    
    // server configs and midlewares
    app.use(handleParams);
    app.set('trust proxy', config.server.trust_proxy); // set if trust proxy is true or false
    app.use(session(config.server.session)); // use session in server
    app.set('socket-io', io); // attach socket.io in server

    // views routes
    app.use('/', routes.index);
    app.use('/app', routes.app);

    // UPLOAD IMAGES ROUTE
    app.use('/api/v1/upload', routes.upload);

    // api routes (CRUD ROUTES)
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
    
    // api routes (REPORTS AND PRINT ROUTES)
    app.use('/api/v1/relatorios', routes.relatorios);
    app.use('/api/v1/etiquetas', routes.etiquetas);

    if(config.isDev){
        
        app.get('/api/v1/teste', async (req, res, next) => {

            const filename = path.join(__dirname, 'teste.pdf');

            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const data = [{
                id : 1,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '0123456789'
            },{
                id : 2,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '0254567891'
            },{
                id : 3,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '1532234542'
            },{
                id : 4,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '9234156720'
            },{
                id : 5,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '1634445893'
            },{
                id : 6,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '1634445893'
            },{
                id : 7,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '1634445893'
            },{
                id : 8,
                nome : 'teste',
                descricao : 'teste',
                secao : 'teste',
                quantidade : 10,
                codigo_barras : '1634445893'
            }];

            let pos_x = 30;
            let pos_y = 30;
            
            doc.pipe(fs.createWriteStream(filename));
            doc.font(path.join(__dirname, 'public', 'fonts', 'LibreBarcode39-Regular.ttf'));

            let row_int = 0;
            
            data.forEach((row, i) => {
                
                doc.fontSize(30).text(row.codigo_barras, pos_x, pos_y);
                
                if(row_int == 3){
                    row_int = 0;
                }

                if(row_int < 2){
                    pos_x += 175;
                }else{
                    pos_x = 30;
                    pos_y += 30;
                }

                row_int += 1;
                
            });
            
            doc.end();

            res.json({ error : false, filename });

        });

    }

    // START HTTP OR HTTPS SERVER
    server.listen(config.server.port, config.server.hostname, () => {

        let app_url = `${config.server.use_https ? 'https://' : 'http://'}${config.server.hostname}:${config.server.port}`;

        config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.green}[+] Server listening on${config.colors.reset}`, `${config.colors.underscore}${config.colors.fg.yellow}${config.colors.bright}${app_url}${config.colors.reset}`) : '';

        async function start_chrome(){ // Start chome automatic
            config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.green}[+] Starting chrome on ${config.colors.underscore}${config.colors.fg.yellow}${app_url}${config.colors.reset}`) : '';
            const { stdout, stderr } = await exec(`start chrome.exe ${app_url}`);

            if(stderr.read()){
                throw new Error(`Ocorreu um erro ao iniciar o chrome ${stderr.read()}`)
            }
        }

        config.server.start_chrome ? start_chrome() : (config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.red}[-] Chrome not started automatily`, config.colors.reset) : '');
        
        /*async function gen_password(){
            const bcrypt = require('bcrypt');
            console.log(await bcrypt.hash('admtiapi', 10))
        }

        gen_password();*/

    });

    // SOCKET.IO LISTENERS
    io.on('connection', socket => {

        console.log('Connected from' + socket.id);

        socket.join(socket.id); // join new socket connection

        scanner.on('code', code => { // Listener barcodes
            //console.log(code);
            socket.emit('codigo_barras', code);
        });

        socket.on('disconnect', () => { // disconnect socket
            console.log('Disconnected', socket.id);
            //scanner.off();
        })

    });

})();