const index = require('../Controllers/index')(),
    usuarios = require('../Controllers/usuarios')(),
    clientes = require('../Controllers/clientes')(),
    fornecedores = require('../Controllers/fornecedores')(),
    vendedores = require('../Controllers/vendedores')(),
    prestadores_servicos = require('../Controllers/prestadores_servicos')(),
    funcionarios = require('../Controllers/funcionarios')(),
    app = require('../Controllers/app')(),
    produtos = require('../Controllers/produtos')(),
    estoque_material_producao = require('../Controllers/estoque_material_producao')(),
    estoque_produto_final = require('../Controllers/estoque_produto_final')(),
    formas_pagamentos = require('../Controllers/formas_pagamentos')(),
    contas_pagar = require('../Controllers/contas_pagar')(),
    contas_receber = require('../Controllers/contas_receber')(),
    caixa = require('../Controllers/caixa')(),
    etiquetas = require('../Controllers/etiquetas')()
    relatorios = require('../Controllers/relatorios')();

module.exports = {

    index,usuarios,clientes,vendedores,fornecedores,produtos,funcionarios,prestadores_servicos,estoque_material_producao,estoque_produto_final,formas_pagamentos,contas_pagar,contas_receber,caixa,relatorios,etiquetas,app

}