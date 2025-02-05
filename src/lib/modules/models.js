/**
 * @file models.js
 * @description Associação de tabelas
 * @version 2.1.2
 * @package mimostiapi
 * @author Daniel Victor Freire
 * @copyright Mimos tia Pi 2025
 */

/**
 * Importa os modelos necessários para a associação de tabelas.
 * 
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('../Models/Usuarios')} Usuarios
 * @typedef {import('../Models/Clientes')} Clientes
 * @typedef {import('../Models/Fornecedores')} Fornecedores
 * @typedef {import('../Models/Vendedores')} Vendedores
 * @typedef {import('../Models/PrestadoresServicos')} PrestadoresServicos
 * @typedef {import('../Models/Funcionarios')} Funcionarios
 * @typedef {import('../Models/Produtos')} Produtos
 * @typedef {import('../Models/ProdutosCategorias')} ProdutosCategorias
 * @typedef {import('../Models/ProdutosSecoes')} ProdutosSecoes
 * @typedef {import('../Models/ProdutosCor')} ProdutosCor
 * @typedef {import('../Models/EstoqueMaterialProducao')} EstoqueMaterialProducao
 * @typedef {import('../Models/EstoqueProdutoFinal')} EstoqueProdutoFinal
 * @typedef {import('../Models/Caixa')} Caixa
 * @typedef {import('../Models/CaixaTemp')} CaixaTemp
 * @typedef {import('../Models/ContasPagar')} ContasPagar
 * @typedef {import('../Models/ContasReceber')} ContasReceber
 * @typedef {import('../Models/FormasPagamento')} FormasPagamentos
 * @typedef {import('../Models/Unidades')} Unidades
 */

/**
 * @type {Sequelize}
 * @type {Usuarios}
 * @type {Clientes}
 * @type {Fornecedores}
 * @type {Vendedores}
 * @type {PrestadoresServicos}
 * @type {Funcionarios}
 * @type {Produtos}
 * @type {ProdutosCategorias}
 * @type {ProdutosSecoes}
 * @type {ProdutosCor}
 * @type {EstoqueMaterialProducao}
 * @type {EstoqueProdutoFinal}
 * @type {Caixa}
 * @type {CaixaTemp}
 * @type {ContasPagar}
 * @type {ContasReceber}
 * @type {FormasPagamentos}
 * @type {Unidades}
 */
const sequelize = require('sequelize'),
Usuarios = require('../Models/Usuarios'),
Clientes = require('../Models/Clientes'),
Fornecedores = require('../Models/Fornecedores'),
Vendedores = require('../Models/Vendedores'),
PrestadoresServicos = require('../Models/PrestadoresServicos'),
Funcionarios = require('../Models/Funcionarios'),
Produtos = require('../Models/Produtos'),
ProdutosCategorias = require('../Models/ProdutosCategorias'),
ProdutosSecoes = require('../Models/ProdutosSecoes'),
ProdutosCor = require('../Models/ProdutosCor'),
EstoqueMaterialProducao = require('../Models/EstoqueMaterialProducao'),
EstoqueProdutoFinal = require('../Models/EstoqueProdutoFinal'),
Caixa = require('../Models/Caixa'),
CaixaTemp = require('../Models/CaixaTemp'),
ContasPagar = require('../Models/ContasPagar'),
ContasReceber = require('../Models/ContasReceber'),
FormasPagamentos = require('../Models/FormasPagamento'),
Unidades = require('../Models/Unidades');

/**
 * Define as associações entre os modelos.
 * 
 * @function
 */

ProdutosCategorias.belongsTo(ProdutosSecoes, { foreignKey: 'secao', allowNull: false });
ProdutosCategorias.belongsTo(Produtos, { foreignKey: 'id' });

Produtos.belongsTo(ProdutosCategorias, { foreignKey: 'categoria', allowNull: false });
Produtos.belongsTo(ProdutosSecoes, { foreignKey: 'secao', allowNull: false });
Produtos.belongsTo(ProdutosCor, { foreignKey: 'cor', allowNull: false });
Produtos.belongsTo(EstoqueProdutoFinal, { foreignKey: 'id', allowNull: false });

EstoqueMaterialProducao.belongsTo(ProdutosCor, { foreignKey: 'cor', allowNull: false });
EstoqueMaterialProducao.belongsTo(Unidades, { foreignKey: 'unidade', allowNull: false });

EstoqueProdutoFinal.belongsTo(Produtos, { foreignKey: 'produto', as: 'nome_produto', allowNull: false });

CaixaTemp.belongsTo(Caixa, { foreignKey: 'caixa_id', allowNull: false });
CaixaTemp.belongsTo(Produtos, { foreignKey: 'produto_id', allowNull: false });
CaixaTemp.belongsTo(FormasPagamentos, { foreignKey: 'forma_pagamento_id', allowNull: false });

ContasPagar.belongsTo(Fornecedores, { foreignKey: 'fornecedor_id', allowNull: false });
ContasPagar.belongsTo(FormasPagamentos, { foreignKey: 'forma_pagamento', allowNull: false });

ContasReceber.belongsTo(Clientes, { foreignKey: 'cliente_id', allowNull: false });
ContasReceber.belongsTo(FormasPagamentos, { foreignKey: 'forma_pagamento', allowNull: false });

/**
 * Exporta os modelos e a instância do Sequelize.
 * 
 * @module models
 * @type {object}
 * @property {Usuarios} Usuarios - Modelo de Usuários
 * @property {Clientes} Clientes - Modelo de Clientes
 * @property {Fornecedores} Fornecedores - Modelo de Fornecedores
 * @property {Vendedores} Vendedores - Modelo de Vendedores
 * @property {PrestadoresServicos} PrestadoresServicos - Modelo de Prestadores de Serviços
 * @property {Funcionarios} Funcionarios - Modelo de Funcionários
 * @property {Produtos} Produtos - Modelo de Produtos
 * @property {ProdutosCategorias} ProdutosCategorias - Modelo de Categorias de Produtos
 * @property {ProdutosSecoes} ProdutosSecoes - Modelo de Seções de Produtos
 * @property {ProdutosCor} ProdutosCor - Modelo de Cores de Produtos
 * @property {EstoqueMaterialProducao} EstoqueMaterialProducao - Modelo de Estoque de Material de Produção
 * @property {EstoqueProdutoFinal} EstoqueProdutoFinal - Modelo de Estoque de Produto Final
 * @property {Caixa} Caixa - Modelo de Caixa
 * @property {CaixaTemp} CaixaTemp - Modelo de Caixa Temporária
 * @property {ContasPagar} ContasPagar - Modelo de Contas a Pagar
 * @property {ContasReceber} ContasReceber - Modelo de Contas a Receber
 * @property {FormasPagamentos} FormasPagamentos - Modelo de Formas de Pagamento
 * @property {Unidades} Unidades - Modelo de Unidades
 * @property {Sequelize} sequelize - Instância do Sequelize
 */

ProdutosCategorias.belongsTo(Produtos, { foreignKey : 'id' });

EstoqueMaterialProducao.belongsTo(ProdutosCor, { foreignKey : 'cor', allowNull : false });
EstoqueMaterialProducao.belongsTo(Unidades, { foreignKey : 'unidade', allowNull : false });
//EstoqueProdutoFinal.belongsTo(ProdutosCor, { foreignKey : 'cor', allowNull : false });
EstoqueProdutoFinal.belongsTo(Produtos, { foreignKey : 'produto', as : 'produto_nome', allowNull : false });

CaixaTemp.belongsTo(Caixa, { foreignKey : 'caixa_id', allowNull : false });
CaixaTemp.belongsTo(Produtos, { foreignKey : 'produto_id', allowNull : false });
CaixaTemp.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento_id', allowNull : false });

ContasPagar.belongsTo(Fornecedores, { foreignKey : 'fornecedor_id', allowNull : false });
ContasPagar.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento', allowNull : false });

ContasReceber.belongsTo(Clientes, { foreignKey : 'cliente_id', allowNull : false });
ContasReceber.belongsTo(FormasPagamentos, { foreignKey : 'forma_pagamento', allowNull : false });

/**
 * @var {object}
 */
module.exports = { Usuarios,Clientes,Fornecedores,Vendedores,Funcionarios,Produtos,ProdutosSecoes,ProdutosCategorias,ProdutosCor,EstoqueMaterialProducao,EstoqueProdutoFinal,Caixa,CaixaTemp,ContasPagar,ContasReceber,FormasPagamentos,Unidades,PrestadoresServicos,sequelize }
