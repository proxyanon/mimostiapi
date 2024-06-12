const express = require('express'),
    app = express(),
    config = require('./lib/config'),
    { handleParams } = require('./lib/modules/Security'),
    http_ = require('http'),
    https_ = require('https'),
    sequelize = require('sequelize'),
    cookieParser = require('cookie-parser'),
    //session = cookieSession(config.session),
    session = require('express-session'),
    cors = require('cors'),
    helmet = require('helmet'),
    path = require('path'),
    fs = require('fs'),
    { Server } = require('socket.io'),
    routes = require('./lib/modules/routes'),
    compression = require('compression'),
    BarcodeScanner = require('native-barcode-scanner'),
    PDFDocument = require('pdfkit'),
    { xss } = require('express-xss-sanitizer'),
    { exec } = require('child_process'),
    fileUpload = require('express-fileupload');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
    contentSecurityPolicy : false
}));
app.use(cors());
app.use(xss())
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(fileUpload());

app.use('/public', express.static(path.join(__dirname, 'public')));

let server = null;

try{
    server = config.server.use_https ? https_.createServer({ cert : fs.readFileSync(config.server.https.cert), key : fs.readFileSync(config.server.https.key), rejectUnauthorized : true }, app) : http_.createServer(app);
}catch(err){
    throw err;
}

const io = new Server(server);
const scanner = new BarcodeScanner({});

(async () => {

    const db = require('./lib/modules/database');

    try{
        await db.sync();
    }catch(err){
        throw err;
    }

    config.server.start_chrome = config.isDev ? false : true;
    config.server.session.cookie.secure = config.server.port == 443 ? true : false;
    
    app.use(handleParams);
    app.set('trust proxy', config.server.trust_proxy);
    app.use(session(config.server.session));
    app.set('socket-io', io);

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

    app.post('/api/v1/upload', (req, res, next) => {

        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        sampleFile = req.files.sampleFile;
        upload1Path = __dirname + '/somewhere/on/your/server/' + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
            if (err){
                return res.status(500).send(err);
            }
            res.send('File uploaded!');
        });

    });

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

    server.listen(config.server.port, config.server.hostname, () => {

        let app_url = `${config.server.use_https ? 'https://' : 'http://'}${config.server.hostname}:${config.server.port}`;

        config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.green}[+] Server listening on${config.colors.reset}`, `${config.colors.underscore}${config.colors.fg.yellow}${config.colors.bright}${app_url}${config.colors.reset}`) : '';

        async function start_chrome(){
            config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.green}[+] Starting chrome on ${config.colors.underscore}${config.colors.fg.yellow}${app_url}${config.colors.reset}`) : '';
            const { stdout, stderr } = await exec(`start chrome.exe ${app_url}`);

            if(stderr.read()){
                throw new Error(`Ocorreu um erro ao iniciar o chrome ${stderr.read()}`)
            }
        }

        config.server.start_chrome ? start_chrome() : (config.isDev || config.verbose ? console.log(`${config.colors.bright}${config.colors.fg.red}[-] Chrome not started automatily`, config.colors.reset) : '');
        
        async function gen_password(){
            const bcrypt = require('bcrypt');
            console.log(await bcrypt.hash('admlaura', 10))
        }

        gen_password();

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