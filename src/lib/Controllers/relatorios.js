const express = require('express');
const models = require('../modules/models');
const path = require('path');
const fs = require('fs');
const PDFDocument = require("pdfkit-table");

const Security = require('../modules/Security');
const Sequelize = require('../modules/database');

const sec = new Security();
const router = express.Router();

module.exports = () => {

    var module = {};

    module.getDataAtual = (datecreated) => {

        let today = new Date(datecreated);
        
        let day = today.getDate();
        let month = today.getMonth()+1 > 10 ? today.getMonth()+1 : `0${today.getMonth()+1}`;
        let year = today.getFullYear();

        return `${day}/${month}/${year}`;

    }

    module.formatMoney = (value) => {
        return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
    }

    module.relatorioContas = async (req, res, next) => {
        
        if(!req.body.periodo_inicial || !req.body.periodo_final){
            return res.status(401).json({ error : true, msg : 'Preencha o período inicial e final' });
        }

        const { periodo_inicial, periodo_final } = req.body;

        console.log(req.body);

        let filename = path.join(__dirname, '..', '..', 'public', 'pdfs', `${Security.makeid(10)}.pdf`);
        let query = `SELECT contas_${req.params.type}.id,${req.params.type == 'pagar' ? 'fornecedores' : 'clientes'}.nome AS ${req.params.type == 'pagar' ? 'fornecedor' : 'cliente'},formas_pagamentos.nome AS forma_pagamento,contas_${req.params.type}.valor,contas_${req.params.type}.descricao,contas_${req.params.type}.datecreated  FROM contas_${req.params.type} LEFT JOIN formas_pagamentos ON contas_${req.params.type}.forma_pagamento=formas_pagamentos.id LEFT JOIN ${req.params.type == 'pagar' ? 'fornecedores' : 'clientes'} ON contas_${req.params.type}.${req.params.type == 'pagar' ? 'fornecedor_id' : 'cliente_id'}=${req.params.type == 'pagar' ? 'fornecedores' : 'clientes'}.id WHERE contas_${req.params.type}.id IS NOT NULL AND DATE(contas_${req.params.type}.datecreated) BETWEEN :periodo_inicial AND :periodo_final ORDER BY contas_${req.params.type}.id`;
        let valor_total = 0;
        
        const [results,metadata] = await Sequelize.query(query, {
            type : models.sequelize.QueryTypes.RAW,
            replacements : { periodo_inicial : periodo_inicial, periodo_final : periodo_final }
        });

        if(results.length == 0){
            return res.status(401).json({ error : true, msg : 'Nada encontrado no período selecionado' });
        }

        let headers = [{
            label : '#', property : 'id', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : req.params.type == 'pagar' ? 'FORNECEDOR' : 'CLIENTE', property : req.params.type == 'pagar' ? 'fornecedor' : 'cliente', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'FORMA PAG.', property : 'forma_pagamento', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'VALOR', property : 'valor', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'DESCRIÇÃO', property : 'descricao', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'DATA', property : 'datecreated', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        }];

        let rows = results.map((conta) => {
            conta.id = `${conta.id}`;
            valor_total += parseFloat(conta.valor);
            conta.valor = `R$ ${parseFloat(conta.valor).toFixed(2).replace('.', ',')}`;
            conta.datecreated = `${module.getDataAtual(conta.datecreated)}`;
            return Object.values(conta);
        });

        let title = { label : `Relatório de contas a ${req.params.type}`, fontSize : 14.5 };

        let doc = new PDFDocument({ margin: 30, size: 'A4' });

        doc.pipe(fs.createWriteStream(filename));

        const table = { 
            title: title,
            headers: headers,
            rows: rows,
        };
    
        await doc.table(table, {
            width : 540, 
            prepareHeader : () => {
                doc.font("Helvetica-Bold").fontSize(10.35).fillColor('#ffffff');
            },
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(9.6).fillColor('#000000');
            } 
        });

        doc
         .font('Helvetica')
         .fontSize(10.35)
         .text(`Valor a ${req.params.type}: R$ ${module.formatMoney(valor_total)}`, {
            width : 540,
            align : 'right'
         });

        doc.image(path.join(__dirname, '..', '..', 'public', 'img', 'logo.png'), 540, 10, { width : 30 });
    
        doc.end();

        res.json({ error : false, filename : path.basename(filename) });

    }

    module.relatorioVendas = async (req, res, next) => {

        if(!req.body.periodo_inicial || !req.body.periodo_final){
            return res.status(401).json({ error : true, msg : 'Preencha o período inicial e final' });
        }

        const { periodo_inicial, periodo_final } = req.body;

        let filename = path.join(__dirname, '..', '..', 'public', 'pdfs', `${Security.makeid(10)}.pdf`);
        let query = 'SELECT caixa_temp.id,caixa.nome AS caixa,produtos.nome AS produto,caixa_temp.quantidade as quantidade,formas_pagamentos.nome AS forma_pagamento,produtos.preco AS valor,caixa_temp.datecreated,caixa.saida as saida,caixa.entrada as entrada,caixa.saldo as saldo FROM caixa_temp LEFT JOIN caixa ON caixa_temp.caixa_id=caixa.id LEFT JOIN produtos ON caixa_temp.produto_id=produtos.id LEFT JOIN formas_pagamentos ON caixa_temp.forma_pagamento_id=formas_pagamentos.id WHERE caixa_temp.id IS NOT NULL AND DATE(caixa_temp.datecreated) BETWEEN :periodo_inicial AND :periodo_final ORDER BY caixa_temp.id';
        let valor_total = 0;
        let entrada = 0;
        let saida = 0;
        let saldo = 0;
        
        const [results,metadata] = await Sequelize.query(query, {
            type : models.sequelize.QueryTypes.RAW,
            replacements : { periodo_inicial : periodo_inicial, periodo_final : periodo_final }
        });

        if(results.length == 0){
            return res.status(401).json({ error : true, msg : 'Nada encontrado no período selecionado' });
        }

        let headers = [{
            label : '#', property : 'id', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'CAIXA', property : 'caixa', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'PRODUTO', property : 'caixa', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'QTD.', property : 'quantidade', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'FORMA PAG.', property : 'forma_pagamento', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'VALOR', property : 'valor', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'DATA', property : 'datecreated', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        }];

        let rows = results.map((caixa_temp) => {
            
            valor_total += parseFloat(caixa_temp.valor * caixa_temp.quantidade);
            entrada = caixa_temp.entrada;
            saida = caixa_temp.saida;
            saldo = caixa_temp.saldo;

            delete caixa_temp['entrada'];
            delete caixa_temp['saida'];
            delete caixa_temp['saldo'];
            
            caixa_temp.id = `${caixa_temp.id}`;
            caixa_temp.quantidade = `${caixa_temp.quantidade}`;
            caixa_temp.valor = `R$ ${parseFloat(caixa_temp.valor).toFixed(2).replace('.', ',')}`;
            caixa_temp.datecreated = `${module.getDataAtual(caixa_temp.datecreated)}`;

            return Object.values(caixa_temp);

        });

        let title = { label : 'Relatório de vendas', fontSize : 14.5 };

        let doc = new PDFDocument({ margin: 30, size: 'A4' });

        doc.pipe(fs.createWriteStream(filename));

        const table = { 
            title: title,
            headers: headers,
            rows: rows,
        };
    
        await doc.table(table, {
            width : 540, 
            prepareHeader : () => {
                doc.font("Helvetica-Bold").fontSize(10.35).fillColor('#ffffff');
            },
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(9.6).fillColor('#000000');
            } 
        });

        //valor_total = valor_total - parseFloat(saida);

        doc
         .font('Helvetica')
         .fontSize(10.35)
         .text(`Entrada: ${module.formatMoney(entrada)}      Saída: ${module.formatMoney(saida)}      Saldo: R$ ${module.formatMoney(saldo)}`, {
            width : 540,
            align : 'right'
         });

        doc.image(path.join(__dirname, '..', '..', 'public', 'img', 'logo.png'), 540, 10, { width : 30 });
    
        doc.end();

        res.json({ error : false, filename : path.basename(filename) });

    }

    module.relatorioOrdemServico = async (req, res, next) => {

        if(!req.body.produtos){
            return res.status(401).json({ error : true, msg : 'Escolha algum produto' });
        }

        console.log(req.body);

        const { produtos } = req.body;

        if(!produtos.length){
            return res.status(401).json({ error : true, msg : 'Escolha algum produto' });
        }

        let produtos_ids = produtos.map((produto) => { return produto.id; });

        let filename = path.join(__dirname, '..', '..', 'public', 'pdfs', `${Security.makeid(10)}.pdf`);
        let query = 'SELECT produtos.id,produtos.nome,produtos_secoes.nome as secao,produtos_categorias.nome as categoria,produtos.descricao FROM produtos LEFT JOIN produtos_secoes ON produtos.secao=produtos_secoes.id LEFT JOIN produtos_categorias ON produtos.categoria=produtos_categorias.id LEFT JOIN produtos_cor ON produtos.cor=produtos_cor.id WHERE produtos.id IN (:produtos) AND produtos.id IS NOT NULL ORDER BY produtos.id';
        
        const [results,metadata] = await Sequelize.query(query, {
            type : models.sequelize.QueryTypes.RAW,
            replacements : { produtos: produtos_ids }
        });

        if(results.length == 0){
            return res.status(401).json({ error : true, msg : 'Nada encontrado no período selecionado' });
        }

        let headers = [{
            label : '#', property : 'id', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'PRODUTO', property : 'nome', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'SEÇÃO', property : 'secao', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'CATEGORIA', property : 'categoria', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'DESCRICAO', property : 'descricao', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        },{
            label : 'QTD.', property : 'quantidade', align : 'center', headerAlign : 'center', headerColor : '#823a6a', headerOpacity : 1
        }];

        let rows = results.map((produto,i) => {
            
            produto.id = `${i+1}`;
            produto.quantidade = `${produtos[i].quantidade}`;

            return Object.values(produto);

        });

        let title = { label : 'Ordem de serviço', fontSize : 14.5 };

        let doc = new PDFDocument({ margin: 30, size: 'A4' });

        doc.pipe(fs.createWriteStream(filename));

        const table = { 
            title: title,
            headers: headers,
            rows: rows,
        };
    
        await doc.table(table, {
            width : 540, 
            prepareHeader : () => {
                doc.font("Helvetica-Bold").fontSize(10.35).fillColor('#ffffff');
            },
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(9.6).fillColor('#000000');
            } 
        });

        doc.image(path.join(__dirname, '..', '..', 'public', 'img', 'logo.png'), 540, 10, { width : 30 });
    
        doc.end();

        res.json({ error : false, filename : path.basename(filename) });

    }

    router
        //.use(sec.middlewares.auth_check)
        .use(sec.responses.setResponses)
        .post('/ordem_servico', module.relatorioOrdemServico)
        .post('/contas/:type', module.relatorioContas)
        .post('/vendas', module.relatorioVendas)

    return router;

}