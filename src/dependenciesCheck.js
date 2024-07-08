const { exec } = require('child_process');
//const modules = ['xyz', 'http','https','sequelize','cookie-parser','express-session','cors','helmet','path','fs','socket.io','compression','native-barcode-scanner','pdfkit','express-xss-sanitizer','child_process','express-fileupload'];

const modules = [];
const config = require('./lib/config');

const fs = require('fs');

const mainContent = fs.readFileSync('.\\src\\main.js', { encoding : 'utf-8', flag : 'r' });

let rows = mainContent.split('\n');

rows.forEach(row => {

    if(row.includes("require(") && !row.includes('./')){

        if(row.includes('const')){
            row = row.replace('const ', '');
            row = row.split('=')[1]
            row = row.split("require('")[1].split("')")[0]
        }else{
            row = row.split('=')[1]
            row = row.split("require('")[1].split("')")[0]
        }

        modules.push(row);
    }

});

async function install_dependencies(module_name, auto_install=false){

    let installed = true;

    try{
        require(module_name)
    }catch(err){
        installed = false;
    }

    if(!installed && auto_install){

        try{
    
            const { stdout, stderr } = await exec(`npm i -s ${module_name}`);
    
            if(stderr.read()){
                installed = false;
                console.error(`[x] Não foi possível instalar o módulo ${module_name}`);
                console.error(`[x] stderr output => ${stderr.read()}`);
            }

            installed ? console.log(`[+] Modulo ${module_name} foi instalado com sucesso`) : console.log(`[x] O módulo não existe ${module_name}`);
    
        }catch(err){
    
            console.error(err)
            //throw new Error(err);
    
        }

    }else{
        console.log(`O módulo ${module_name} já está instalado`);
    }

    return installed;

}

modules.forEach(async (module_name, i) => {
    await install_dependencies(module_name, config.install_deps.auto_install);
    if(i == modules.length-1 && config.install_deps.run_app_after_check){
        await run_app()
    }
});

async function run_app(){
    const { stdout, stderr } = await exec(`start nodemon src\\main.js`);
    if(stderr.read()){
        console.error(stderr.read())
    }else{
        console.log(stdout.read())
    }
}

module.exports = { install_dependencies, modules }