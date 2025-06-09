const path = require('path');
const Security = require('./Security');
const config = require('../config');

const sec = new Security();

function upload(req, res, next){

    if(req.files){
    
        let sampleFile;
        let uploadPath;
        const { accepted_ext, accepted_mime_types } = config.uploads;

        if(!Object.keys(req).includes('files')){
            return res.status(403).json({ error : true, msg : 'Nenhum arquivo foi carregado' });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(403).json({ error : true, msg : 'Nenhum arquivo foi carregado' });
        }

        if(!Object.keys(req.files).includes('foto') || !req.files.foto){
            return res.status(403).json({ error : true, msg : 'O campo foto precisa ser preenchido' });
        }

        sampleFile = req.files.foto;
        //uploadPath = path.join(__dirname, '..', '..', 'public', 'files', Security.makeid(10) + '.png');
        uploadPath = path.join(config.uploads.upload_path, `${Security.makeid(10)}.png`);

        verbose ? console.log(`Upload Path: ${uploadPath}`) : null

        if(accepted_ext.includes(path.extname(sampleFile.name)) && accepted_mime_types.includes(sampleFile.mimetype)){

            //console.log(sampleFile, uploadPath);

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(uploadPath, function(err) {
                if (err){
                    return res.status(500).json({ error : true, msg : err.toString() });
                }
                //return res.json({ error : false, msg : 'Uploaded' });
                req.upload_path = uploadPath;
                next();
            });

        }else{
            return res.status(401).json({ error : true, msg : 'Tipo de arquivo inválido apenas arquivos de imagens serão aceitos (.png,.jpg,.jpeg,.gif)' });
        }
    
    }else{
        return res.status(403).json({ error : true, msg : 'Nenhum arquivo carregado' });
    }

}

module.exports = { upload };