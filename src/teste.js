const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const Security = require('./lib/modules/Security');

function getDataAtual(){

    let today = new Date();
    
    let day = today.getDate();
    let month = today.getMonth()+1 > 10 ? today.getMonth()+1 : `0${today.getMonth()+1}`;
    let year = today.getFullYear();

    return `${year}-${month}-${day}`;

}

function getHoraAtual(){

    let today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    return `${hours}:${minutes}:${seconds}`;

}

async function create_pdf(){

    let data_atual = getDataAtual();
    let hora_atual = getHoraAtual();
    
    const savePathFilename = path.join(__dirname, 'public', 'pdfs', 'teste.pdf');
    
    let linesize = 10;
    let fsize = 20;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const page_options = { width, height, x : 10, y : 50 };
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Relatório vendas', {
        x: page_options.x,
        y: height - page_options.y + linesize * 2,
        size: fsize,
        color: rgb(0, 0, 0),
    });

    fsize = 10;
    baseline = 30;

    const produtos = [{
        nome : 'Teste',
        qtd : 10
    }, {
        nome : 'Produto teste',
        qtd : 2
    },{
        nome : 'Produto X',
        qtd : 5
    },{
        nome : 'Produto Y',
        qtd : 1
    }, {
        nome : 'Conjunto X',
        qtd : 2
    }];

    const vendas = [{
        id : 1,
        caixa : 'CAIXA PDV PRODUTOS',
        produto : 'Conjunto Y',
        forma_pagamento : 'PIX',
        datecreated : '02/02/2024 às 13:20'
    },{
        id : 2,
        caixa : 'CAIXA PDV PRODUTOS',
        produto : 'Produto teste',
        forma_pagamento : 'DINHEIRO',
        datecreated : '02/02/2024 às 12:02'
    },{
        id : 3,
        caixa : 'CAIXA PDV PRODUTOS',
        produto : 'Toalha X',
        forma_pagamento : 'PIX',
        datecreated : '02/02/2024 às 11:50'
    },{
        id : 4,
        caixa : 'CAIXA PDV PRODUTOS',
        produto : 'Toalha X',
        forma_pagamento : 'CARTÃO CRÉDITO',
        datecreated : '02/02/2024 às 12:12'
    }];

    tbl = pdfDoc.add_

    vendas.forEach((venda) => {

        page.drawRectangle({
            x: page_options.x,
            y: height - page_options.y - linesize - baseline - 10,
            width: page_options.width - 50,
            height: 30,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
            opacity: 1,
            borderOpacity: 1,
        });

        page.drawText(`${venda.id}`, {
            x: page_options.x + 10,
            y: height - page_options.y - linesize - baseline,
            width : 100,
            height : 200,
            size: fsize,
            lineHeight : 20,
            align : 'justify',
            font: helveticaFont,
            color: rgb(0, 0, 0),
            avoidbreak : true
        })

        page.drawText(venda.caixa, {
            x: page_options.x + 30,
            y: height - page_options.y - linesize - baseline,
            width : 100,
            height : 200,
            size: fsize,
            lineHeight : 20,
            align : 'justify',
            font: helveticaFont,
            color: rgb(0, 0, 0),
            avoidbreak : true
        });

        page.drawText(venda.produto, {
            x: page_options.x + 200,
            y: height - page_options.y - linesize - baseline,
            width : 100,
            height : 200,
            size: fsize,
            lineHeight : 20,
            align : 'justify',
            font: helveticaFont,
            color: rgb(0, 0, 0),
            avoidbreak : true
        });

        page.drawText(venda.datecreated, {
            x: page_options.x + 400,
            y: height - page_options.y - linesize - baseline,
            width : 100,
            height : 200,
            size: fsize,
            lineHeight : 20,
            align : 'justify',
            font: helveticaFont,
            color: rgb(0, 0, 0),
            avoidbreak : true
        })

        // page.drawText(`${venda.id}     |     ${venda.caixa}     |     ${venda.produto}     |     ${venda.datecreated}`, {
        //     x: page_options.x + 10,
        //     y: height - page_options.y - linesize - baseline,
        //     width : 100,
        //     height : 200,
        //     size: fsize,
        //     lineHeight : 20,
        //     align : 'justify',
        //     font: helveticaFont,
        //     color: rgb(0, 0, 0),
        //     avoidbreak : true
        // })

        baseline += 30;

    });

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(savePathFilename, pdfBytes);

};

create_pdf();