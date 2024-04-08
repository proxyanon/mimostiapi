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
    PDFDocument = require('pdfkit'),
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
    app.use('/api/v1/etiquetas', routes.etiquetas);

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

    https_server.listen(config.server.port, () => {
        
        config.isDev || config.verbose ? console.log('[+] Server listening on', config.server.port) : '';

        async function start_chrome(){
            const { stdout, stderr } = await exec('start chrome.exe https://localhost');
        }

        config.server.start_chrome ? start_chrome() : console.log('chrome not started automatily');

    });

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