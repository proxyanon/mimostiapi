const sequelize = require('sequelize');
const Usuarios = require('../Models/Usuarios'),
 Clientes = require('../Models/Clientes'),
 Fornecedores = require('../Models/Fornecedores'),
 Vendedores = require('../Models/Vendedores'),
 PrestadoresServicos = require('../Models/PrestadoresServicos'),
 Funcionarios = require('../Models/Funcionarios'),
 Produtos = require('../Models/Produtos'),
 //ProdutosCategorias = require('../Models/ProdutosCategorias'),
 ProdutosSecoes = require('../Models/ProdutosSecoes'),
 ProdutosCor = require('../Models/ProdutosCor'),
 EstoqueMaterialProducao = require('../Models/EstoqueMaterialProducao'),
 EstoqueProdutoFinal = require('../Models/EstoqueProdutoFinal'),
 Caixa = require('../Models/Caixa'),
 CaixaTemp = require('../Models/CaixaTemp'),
 ContasPagar = require('../Models/ContasPagar'),
 ContasReceber = require('../Models/ContasReceber'),
 FormasPagamentos = require('../Models/FormasPagamento');

//ProdutosCategorias.belongsTo(ProdutosSecoes, { foreignKey : 'secao', allowNull : false });

//Produtos.belongsTo(ProdutosCategorias, { foreignKey : 'categoria', allowNull : false })
Produtos.belongsTo(ProdutosSecoes, { foreignKey : 'secao', allowNull : false })
Produtos.belongsTo(ProdutosCor, { foreignKey : 'cor', allowNull : false })
Produtos.belongsTo(EstoqueProdutoFinal, { foreignKey : 'id', allowNull : false });

EstoqueMaterialProducao.belongsTo(ProdutosCor, { foreignKey : 'cor', allowNull : false });
//EstoqueProdutoFinal.belongsTo(ProdutosCor, { foreignKey : 'cor', allowNull : false });
EstoqueProdutoFinal.belongsTo(Produtos, { foreignKey : 'produto', as : 'produto_nome', allowNull : false });

CaixaTemp.belongsTo(Caixa, { foreignKey : 'caixa_id', allowNull : false });
CaixaTemp.belongsTo(Produtos, { foreignKey : 'produto_id', allowNull : false });
CaixaTemp.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento_id', allowNull : false });

ContasPagar.belongsTo(Fornecedores, { foreignKey : 'fornecedor_id', allowNull : false });
ContasPagar.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento', allowNull : false });

ContasReceber.belongsTo(Clientes, { foreignKey : 'cliente_id', allowNull : false });
ContasReceber.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento', allowNull : false });

module.exports = {

    Usuarios,Clientes,Fornecedores,Vendedores,PrestadoresServicos,Funcionarios,Produtos,ProdutosSecoes,ProdutosCor,EstoqueMaterialProducao,EstoqueProdutoFinal,Caixa,CaixaTemp,ContasPagar,ContasReceber,FormasPagamentos,sequelize

}