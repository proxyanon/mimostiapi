const btn_save_cliente = document.querySelector('#save-cliente');
const btn_save_fornecedor = document.querySelector('#save-fornecedor');
const btn_save_vendedor = document.querySelector('#save-vendedor');
const btn_save_prestador_servico = document.querySelector('#save-prestador_servico');
const btn_save_funcionario = document.querySelector('#save-funcionario');
const btn_save_estoque_material_producao = document.querySelector('#save-estoque_material_producao');
const btn_save_estoque_produto_final = document.querySelector('#save-estoque_produto_final');
const btn_save_produto = document.querySelector('#save-produto');

btn_save_cliente.addEventListener('click', (e) => {

    let cliente_id = document.querySelector('#cliente-id').value;
    let cliente_data = prepareData('cliente', 'clientes');

    if(!cliente_id){
        
        api.createData(cliente_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('cliente-error', results.msg, 4000);
                }else{
                    getClientes();
                }

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(cliente_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getClientes();
                }else{
                    show('cliente-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });
    
    }

    clearForms();

});

btn_save_fornecedor.addEventListener('click', (e) => {

    let fornecedor_id = document.querySelector('#fornecedor-id').value;
    let fornecedor_data = prepareData('fornecedor', 'fornecedores');

    if(!fornecedor_id){

        api.createData(fornecedor_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('fornecedor-error', results.msg, 4000);
                }else{
                    getFornecedores();
                }

            })
            .catch(err => {
                console.error(err);
            })
    }else{

        api.saveData(fornecedor_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getFornecedores();
                }else{
                    show('fornecedor-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }

    clearForms();

});

btn_save_vendedor.addEventListener('click', (e) => {

    let vendedor_id = document.querySelector('#vendedor-id').value;
    let vendedor_data = prepareData('vendedor', 'vendedores');

    if(!vendedor_id){

        api.createData(vendedor_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('vendedor-error', results.msg, 4000);
                }else{
                    getVendedores();
                }

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        let vendedor_data = prepareData('vendedor', 'vendedores');

        api.saveData(vendedor_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getVendedores();
                }else{
                    show('vendedor-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }

    clearForms();

});

btn_save_prestador_servico.addEventListener('click', (e) => {

    let prestador_servico_id = document.querySelector('#prestador_servico-id').value;
    let prestador_servico_data = prepareData('prestador_servico', 'prestadores_servicos');

    if(!prestador_servico_id){

        api.createData(prestador_servico_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('prestador_servico-error', results.msg, 4000);
                }else{
                    getPrestadoresServicos();
                }

            })
            .catch(err => {
                console.error(err);
            })
    }else{

        api.saveData(prestador_servico_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getPrestadoresServicos();
                }else{
                    show('prestador_servico-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }

});

btn_save_funcionario.addEventListener('click', (e) => {

    let funcionario_id = document.querySelector('#funcionario-id').value;
    let funcionario_data = prepareData('funcionario', 'funcionarios');

    if(!funcionario_id){

        api.createData(funcionario_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('funcionario-error', results.msg, 4000);
                }else{
                    getFuncionarios();
                }
                

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(funcionario_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getFuncionarios();
                }else{
                    show('funcionario-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }

});

btn_save_produto.addEventListener('click', (e) => {

    let produto_id = document.querySelector('#produto-id').value;
    let produto_data = prepareData('produto', 'produtos');

    if(!produto_id){

        api.createData(produto_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('produto-error', results.msg, 4000);
                }else{
                    getProdutos();
                }
                

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(produto_data)
            .then(resp => resp.json())
            .then(results => {
                
                if(!results.error){
                    getProdutos();
                }else{
                    show('produto-error', results.msg, 4000);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }

    clearForms();

});

btn_save_secao.addEventListener('click', (e) => {

    let secao_id = document.querySelector('#modal_secao-id').value;
    let nome = document.querySelector('#modal_secao-nome').value;
    let modal_secao_data = prepareData('modal_secao', 'produtos/secao');
    let elSecaoError = document.querySelector('#modal_secao-error');

    $(elSecaoError).hide();

    if(!secao_id){

        api.createData(modal_secao_data)
            .then(resp => resp.json())
            .then(results => {

                if(!results.error){

                    $('#modal_secao').modal('hide');

                    loadSelectOptions('secao', {
                        placeholder : '-- selecione a seção --',
                        selectElementName : 'produto-secao'
                    });

                }else{
                    $(elSecaoError).show();
                    elSecaoError.innerHTML = `<p>${results.error}</p>` + '\n';
                }

                clearForms();

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(modal_secao_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    console.error(results.msg);
                }else{

                    $('#modal_secao').modal('hide');

                    loadSelectOptions('secao', {
                        placeholder : '-- selecione a seção --',
                        selectElementName : 'produto-secao'
                    });

                    document.querySelector('#produto-secao').value = secao_id;

                }

            })
            .catch(err => {
                console.error(err);
            })

    }


});

btn_save_categoria.addEventListener('click', (e) => {

    let categoria_id = document.querySelector('#modal_categoria-id').value;
    let modal_categoria_data = prepareData('modal_categoria', 'produtos/categoria')
    let elCateogiraError = document.querySelector('#modal_categoria-error');

    $(elCateogiraError).hide();

    if(!categoria_id){

        api.createData(nome,secao)
            .then(resp => resp.json())
            .then(results => {

                if(!results.error){

                    $('#modal_categoria').modal('hide');

                    loadSelectOptions('categoria', {
                        placeholder : '-- selecione a categoira --',
                        selectElementName : 'produto-categoria'
                    });

                }else{
                    $(elCateogiraError).show();
                    elCateogiraError.innerHTML = `<p>${results.error}</p>` + '\n';
                }

                clearForms();

            })
            .catch(err => {
                console.error(err);
            })

        }else{

            api.saveData(modal_categoria_data)
                .then(resp => resp.json())
                .then(results => {

                    if(results.error){
                        console.error(results.msg);
                    }else{

                        $('#modal_categoria').modal('hide');

                        loadSelectOptions('categoria', {
                            placeholder : '-- selecione a categoria --',
                            selectElementName : 'produto-categoria'
                        });

                    }

                })
                .catch(err => {
                    console.error(err);
                })

        }

});

btn_save_cor.addEventListener('click', (e) => {

    let cor_id = document.querySelector('#modal_cor-id').value;
    let modal_cor_data = prepareData('modal_cor', 'produtos/cor')
    let elCorError = document.querySelector('#modal_cor-error');

    $(elCorError).hide();

    if(!cor_id){

        api.createData(modal_cor_data)
            .then(resp => resp.json())
            .then(results => {

                if(!results.error){

                    $('#modal_cor').modal('hide');

                    loadSelectOptions('cor', {
                        placeholder : '-- selecione a cor --',
                        selectElementName : 'produto-cor'
                    });

                }else{
                    console.error(results.msg);
                    $(elCorError).show();
                    elCorError.innerHTML = `<p>${results.error}</p>` + '\n';
                }

                clearForms();


            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(modal_cor_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    console.error(results.msg);
                }else{

                    $('#modal_cor').modal('hide');

                    loadSelectOptions('cor', {
                        placeholder : '-- selecione a cor --',
                        selectElementName : 'produto-cor'
                    });

                }

                })
                .catch(err => {
                    console.error(err);
                })

    }

});

btn_save_estoque_material_producao.addEventListener('click', (e) => {

    let estoque_id = document.querySelector('#estoque_material_producao-id').value;
    let estoque_material_producao_data = prepareData('estoque_material_producao');

    if(!estoque_id){

        api.createData(estoque_material_producao_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('estoque_material_producao-error', results.msg, 4000);
                }else{
                    getEstoqueMaterialProducao();
                }

            })
            .catch(err => {
                console.error(err);
            })

    }else{

        api.saveData(estoque_material_producao_data)
            .then(resp => resp.json())
            .then(results => {

                results = results.results;

                if(results.error){
                    show('estoque_material_producao-error', results.msg, 4000);
                }else{
                    getEstoqueProdutoFinal();
                }

            })
            .catch(err => {
                console.error(err, estoque_material_producao_data);
            })

    }

    clearForms();

});

btn_save_estoque_produto_final.addEventListener('click', (e) => {

    let estoque_id = document.querySelector('#estoque_produto_final-id').value;
    let estoque_produto_final_data = prepareData('estoque_produto_final');

    if(!estoque_id){
        
        api.createData(estoque_produto_final_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('estoque_produto_final-error', results.msg, 4000);
                }else{
                    getEstoqueProdutoFinal();
                }

            })
            .catch(err => {
                console.error(err);
            });

    }else{

        api.saveData(estoque_produto_final_data)
            .then(resp => resp.json())
            .then(results => {

                if(results.error){
                    show('estoque_produto_final-error', results.msg, 4000);
                }else{
                    getEstoqueProdutoFinal();
                }

            })
            .catch(err => {
                console.error(err);
            })

    }

    clearForms();

});