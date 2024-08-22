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

const fs = require('fs');
const md5 = require('md5');

router.post('/upload', (req, res, next) => {
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', '..', 'public', 'files'));
        },
        filename: function (req, file, cb) {
            cb(null, md5(file.originalname) + path.extname(file.originalname))
        } 
    });

    const fileFilter = (req, file, cb) => {

        if(!config.uploads.accepted_ext.includes(path.extname(file.originalname))){
            res.json({ error : true, msg : 'Arquivo não aceito' });
            cb(null, false);
        }

        if(!config.uploads.accepted_mime_types.includes(file.mimetype)){
            res.json({ error : true, msg : 'Tipo de arquivo inválido' });
            cb(null, false);
        }

        cb(null, true);

    }

    multer({ storage, limits : config.uploads.max_file_size, fileFilter }).single('foto')(req, res, error => res.json({ error : false }));

})

/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'public', 'files'));
    },
    filename: function (req, file, cb) {
        cb(null, md5(file.originalname) + path.extname(file.originalname))
    } 
});

const upload = multer({ 
    storage: storage, 
    limits : { fileSize : config.uploads.max_file_size, files : config.uploads.max_files },
    fileFilter : (req, file, cb) => {

        if(!config.uploads.accepted_ext.includes(path.extname(file.originalname))){
            return cb(new Error('Arquivo inválido'));
        }

        if(!config.uploads.accepted_mime_types.includes(file.mimetype)){
            return cb(new Error('Tipo de arquivo inválido'));
        }

        cb(null, true);

    }
});
*/

module.exports = () => {

    var module = {};

    module.deleteMaliciousFile = async (filepath) => {
        try{
            fs.unlinkSync(filepath);
        }catch(err){
            config.verbose || config.isDev ? console.error(err) : '';
        }
    }

    module.test = async (req, res, next) => {

        console.log(req.file);
        console.log(req.body);

        res.json({ error : false, msg : 'Enviado' });

    }

    module.upload = (req, res, next) => {
    
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, 'public', 'files'));
            },
            filename: function (req, file, cb) {
                cb(null, md5(file.originalname) + path.extname(file.originalname))
            } 
        });
    
        const fileFilter = (req, file, cb) => {
    
            if(!config.uploads.accepted_ext.includes(path.extname(file.originalname))){
                return res.json({ error : true, msg : 'Arquivo não aceito' });
            }
    
            if(!config.uploads.accepted_mime_types.includes(file.mimetype)){
                return res.json({ error : true, msg : 'Tipo de arquivo inválido' });
            }
    
            cb(null, true);
    
        }
    
        multer({ storage, limits : config.uploads.max_file_size, fileFilter }).single('foto')(req, res, error => res.json({ error : false, filename : req.file.filename }));
    
    }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        //.post('/test', upload.single('test'), module.test)
        .post('/', module.upload)

    return router;

}

return router;