function getClientes(cliente_id = null, item_name = 'cliente'){

    api.getData({ endpoint : { path : getCurrentDashboard(), id : cliente_id } })
        .then(resp => resp.json())
        .then(results => {

            let fields = results.fields;
            results = results.results;

            loadTable(results, {
                table_name : `${getCurrentDashboard()}-table`,
                table_columns : fields,
                item_name : item_name
            });

        })
        .catch(err => {
            console.error(err);
        })

}

function getFornecedores(fornecedor_id = null){

    api.getData({ endpoint : { path : 'fornecedores', id : fornecedor_id } })
        .then(resp => resp.json())
        .then(results => {

            results = results.results;

            loadTable(results, {
                table_name : 'fornecedores-table',
                table_columns : ['id', 'nome', 'cpf_cnpj', 'endereco', 'ponto_referencia', 'telefone', 'whatsapp', 'instagram', 'datecreated'],
                item_name : 'fornecedor'
            });

            setListener([...document.querySelectorAll('.fornecedor-item')], 'click', e => {

                console.log(e.currentTarget);

            });

        })
        .catch(err => {
            console.error(err);
        })

}

function getVendedores(vendedor_id = null){

    api.getData({ endpoint : { path : 'vendedores', id : vendedor_id } })
        .then(resp => resp.json())
        .then(results => {

            results = results.results;

            loadTable(results, {
                table_name : 'vendedores-table',
                table_columns : ['id', 'nome', 'cpf_cnpj', 'endereco', 'ponto_referencia', 'telefone', 'whatsapp', 'instagram', 'datecreated'],
                item_name : 'vendedor'
            });

            setListener([...document.querySelectorAll('.vendedor-item')], 'click', e => {

                console.log(e.currentTarget);

            });

        })
        .catch(err => {
            console.error(err);
        })

}

function getPrestadoresServicos(prestador_servico_id = null){

    api.getData({ endpoint : { path : 'prestadores_servicos', id : prestador_servico_id } })
        .then(resp => resp.json())
        .then(results => {

            results = results.results;

            loadTable(results, {
                table_name : 'prestadores_servicos-table',
                table_columns : ['id', 'nome', 'cpf_cnpj', 'endereco', 'ponto_referencia', 'telefone', 'whatsapp', 'instagram', 'datecreated'],
                item_name : 'prestador_servico'
            });

        })
        .catch(err => {
            console.error(err);
        })

}

function getFuncionarios(funcionario_id = null){

    api.getData({ endpoint : { path : 'funcionarios', id : funcionario_id } })
        .then(resp => resp.json())
        .then(results => {

            results = results.results;

            console.log(results);

            loadTable(results, {
                table_name : 'funcionarios-table',
                table_columns : ['id', 'nome', 'cpf', 'endereco', 'ponto_referencia', 'telefone', 'whatsapp', 'funcao', 'datecreated'],
                item_name : 'funcionario'
            });

            setListener([...document.querySelectorAll('.funcionario-item')], 'click', e => {

                console.log(e.currentTarget);

            });

        })
        .catch(err => {
            console.error(err);
        })

}

function getProdutos(produto_id = null){

    api.getData({ endpoint : { path : 'produtos', id : produto_id } })
        .then(resp => resp.json())
        .then(results => {
            
            if(!results.error){

                results = results.results;

                let optionsObject = prepareOptions(results);
                let produtos_categorias = optionsObject.produtos_categorias;
                let produtos_secoes = optionsObject.produtos_secoes;
                let produtos_cor = optionsObject.produtos_cores;
                let index = 0;

                console.log(results, produtos_categorias, produtos_secoes, produtos_cor);

                loadTable(results, {
                    table_name : 'produtos-table',
                    table_columns : ['id', 'nome', 'secao', 'categoria', 'preco', 'desconto', 'quantidade', 'cor', 'descricao'],
                    item_name : 'produto'
                });

                loadSelectOptions('categoria', {
                    placeholder : '-- selecione a categoria --',
                    selectElementName : 'produto-categoria'
                });

                loadSelectOptions('secao', {
                    placeholder : '-- selecione a seção --',
                    selectElementName : 'produto-secao'
                });

                loadSelectOptions('cor', {
                    placeholder : '-- selecione a cor --',
                    selectElementName : 'produto-cor'
                });

                loadSelectOptions('secao', {
                    placeholder : '-- selecione a secao --',
                    selectElementName : 'modal_categoria-secao-select'
                });
            }

        })
        .catch(err => {
            console.error(err);
        })

}

function getEstoqueMaterialProducao(estoque_material_producao_id = null){

    api.getData({ endpoint : { path : 'estoque_material_producao', id : estoque_material_producao_id } })
        .then(resp => resp.json())
        .then(results => {

            if(!results.error){
                
                results = results.results;

                loadTable(results, {
                    table_name : 'estoque_material_producao-table',
                    table_columns : ['id', 'especificacao', 'cor', 'unidade', 'entrada', 'saida', 'datecreated', 'estoque'],
                    item_name : 'estoque_material_producao'
                });

                loadSelectOptions('cor', {
                    placeholder : '-- selecione a cor --',
                    selectElementName : 'estoque_material_producao-cor'
                });

                showAlertDiv('success-estoque_material_producao', 'Alterado com sucesso');

            }else{
                showAlertDiv('error-estoque_material_producao', results.msg)
            }

        })
        .catch(err => {
            console.error(err);
        })


    clearForms();

}

function getEstoqueProdutoFinal(estoque_produto_final_id = null){

    api.getData({endpoint : { path : 'estoque_produto_final', id : estoque_produto_final_id }})
        .then(resp => resp.json())
        .then(results => {

            
            if(results.error){

                console.error(results.msg);
                showAlertDiv('error-estoque_produto_final', results.msg);

            }else{

                results = results.results;

                loadTable(results, {
                    table_name : 'estoque_produto_final-table',
                    table_columns : ['id', 'produto_nome', 'cor', 'especificacao', 'entrada', 'saida', 'datecreated', 'estoque'],
                    item_name : 'estoque_produto_final'
                });

                loadSelectOptions('cor', {
                    placeholder : '-- selecione a cor --',
                    selectElementName : 'estoque_produto_final-cor'
                });

                loadSelectOptions('', {
                    placeholder : '-- selecione a produto --',
                    selectElementName : 'estoque_produto_final-produto'
                });

            }


        })
        .catch(err => {
            console.error(err);
        })

}

// GET DATA FROM DATABASE FUNCTIONS
function getEstoqueMaterialProducao(estoque_material_producao_id = null){

    api.getData({ endpoint : { path : 'estoque_material_producao', id : estoque_material_producao_id } })
        .then(resp => resp.json())
        .then(results => {

            if(!results.error){
                
                results = results.results;

                loadTable(results, {
                    table_name : 'estoque_material_producao-table',
                    table_columns : ['id', 'especificacao', 'cor', 'unidade', 'entrada', 'saida', 'datecreated', 'estoque'],
                    item_name : 'estoque_material_producao'
                });

                loadSelectOptions('cor', {
                    placeholder : '-- selecione a cor --',
                    selectElementName : 'estoque_material_producao-cor'
                });

                showAlertDiv('success-estoque_material_producao', 'Alterado com sucesso');

            }else{
                showAlertDiv('error-estoque_material_producao', results.msg)
            }

        })
        .catch(err => {
            console.error(err);
        })


    clearForms();

}

function getEstoqueProdutoFinal(estoque_produto_final_id = null){

    api.getData({endpoint : { path : 'estoque_produto_final', id : estoque_produto_final_id }})
        .then(resp => resp.json())
        .then(results => {

            
            if(results.error){

                console.error(results.msg);
                showAlertDiv('error-estoque_produto_final', results.msg);

            }else{

                results = results.results;

                loadTable(results, {
                    table_name : 'estoque_produto_final-table',
                    table_columns : ['id', 'produto_nome', 'cor', 'especificacao', 'entrada', 'saida', 'datecreated', 'estoque'],
                    item_name : 'estoque_produto_final'
                });

                loadSelectOptions('cor', {
                    placeholder : '-- selecione a cor --',
                    selectElementName : 'estoque_produto_final-cor'
                });

                loadSelectOptions('', {
                    placeholder : '-- selecione a produto --',
                    selectElementName : 'estoque_produto_final-produto'
                });

            }


        })
        .catch(err => {
            console.error(err);
        })

}