const path = require('path');
const fs = require("fs");
const PDFDocument = require("pdfkit-table");

let doc = new PDFDocument({ margin: 30, size: 'A4' });

doc.pipe(fs.createWriteStream(path.join(__dirname, 'public', 'pdfs', 'teste.pdf')));
 
console.log(path.join(__dirname, '..', '..', 'teste'));
return;

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
const headers = [{
    label : 'ID', property : 'id', align : 'center', headerAlign : 'center'
},{
    label : 'CAIXA', property : 'caixa', align : 'center', headerAlign : 'center'
},{
    label : 'PRODUTO', property : 'produto', align : 'center', headerAlign : 'center'
},{
    label : 'FORMA DE PAGAMENTO', property : 'forma_pagamento', align : 'center', headerAlign : 'center'
},{
    label : 'DATA DO REGISTRO', property : 'datecreated', align : 'center', headerAlign : 'center'
}];
const rows = vendas.map((venda) => {
    venda.id = `${venda.id}`;
    return Object.values(venda);
});

async function createTable(){

    const table = { 
        title: { label : 'Relatório vendas', fontSize : 14.5 },
        headers: headers,
        rows: rows,
    };

    await doc.table(table, { 
        width : 540,
        prepareHeader : () => {
            doc.font("Helvetica-Bold").fontSize(10);
        },
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            doc.font("Helvetica").fontSize(9);
        } 
    });

    doc.image('public/img/logo.png', 540, 10, { width : 30 });

    doc.end();

}

createTable();