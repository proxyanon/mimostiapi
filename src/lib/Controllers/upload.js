const multer = require('multer');
const express = require('express');
const models = require('../modules/models')

const Security = require('../modules/Security');
const sequelize = require('../modules/database');
const config = require('../config');

const sec = new Security();
const router = express.Router();

const { xss } = require('express-xss-sanitizer');
const path = require('path');

const md5 = require('md5');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'public', 'files'));
    },
    filename: function (req, file, cb) {
        cb(null, md5(file.originalname) + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

module.exports = () => {

    var module = {};

    module.test = async (req, res, next) => {

        console.log(req.file);
        console.log(req.body);

        res.json({ error : false, msg : 'Enviado' });

    }

    module.upload = async (req, res, next) => {

        if(!req.file){
            return res.status(400).json({ error : true, msg : 'Nenhum arquivo upado' });
        }
    
        let accepted_ext = config.uploads.accepted_ext;
        let accepted_mime_types = config.uploads.accepted_mime_types;
    
        config.isDev || config.verbose ? console.log(path.extname(req.file.filename)) : '';
    
        if(!accepted_ext.includes(path.extname(req.file.filename))){
            return res.status(401).json({ error : true, msg : 'Arquivo inválido' });
        }
    
        config.isDev || config.verbose ? console.log(req.file.mimetype) : '';
    
        if(!accepted_mime_types.includes(req.file.mimetype)){
            return res.status(401).json({ error : true, msg : 'Tipo de arquivo inválido' });
        }
    
        res.json({ error : false, filename : req.file.filename });

    }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .post('/test', upload.single('test'), module.test)
        .post('/', upload.single('foto'), module.upload)

    return router;

}