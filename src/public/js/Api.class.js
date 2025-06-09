class Api {

    constructor(config){
        this.config = config;
        this.headers = {};
        this.url = null;
        this.body = {};
    }

    setDefaultHeaders(){
        this.headers['Content-Type'] = 'application/json'
        this.headers['X-CSRF-TOKEN'] = this.config.csrf_token

        //console.log(this.headers['X-CSRF-TOKEN']);
    }

    setBody(json_data){
        this.body = JSON.stringify(json_data)
    }

    buildURL(route, params=[]){

        let url = `${this.config.endpoint}/${route}`

        if(params.length>0){
            params.forEach(param => {
                url += `/${param}`
            })
        }

        this.url = url;

    }

    login(usuario,senha){
        
        this.setDefaultHeaders();
        this.setBody({usuario,senha})
        this.buildURL('usuarios/login');

        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body,
        })

    }

    getProdutosByCategoria(categoria_id){

        categoria_id = (typeof categoria_id == 'undefined' || categoria_id == null) ? [] : [categoria_id];

        this.setDefaultHeaders();
        this.buildURL('produtos/categoria', categoria_id);

        return fetch(this.url, {
            method : 'GET',
            headers : this.headers
        })

    }

    getProdutosInIds(produtos){

        this.setDefaultHeaders();
        this.setBody({produtos})
        this.buildURL('produtos');

        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body,
        })

    }

    imprimirPedido(transacoes){

        this.setDefaultHeaders();
        this.setBody({transacoes});
        this.buildURL('imprimir/pedido');

        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body
        })

    }

    // GET ANY DATA FROM ANY ENDPOINT
    getData(data){

        if(!data.endpoint){
            console.error('getData error data.endpoint not found', data);
            return false;
        }

        const { endpoint }  = data;

        this.setDefaultHeaders();

        endpoint.id ? this.buildURL(`${endpoint.path}/${endpoint.id}`) : this.buildURL(`${endpoint.path}`);

        return fetch(this.url, {
            method : 'GET',
            headers : this.headers,
        })

    }

    uploadPhoto(file){

        const formData = new FormData();

        formData.append('foto', file);
        
        this.buildURL('upload');

        return fetch(this.url, {
            method : 'POST',
            body : formData
        })

    }

    // CREATE ANY RECORD FROM ANY ENDPOINT
    createData(data){

        const { endpoint, form_data } = data;

        this.setDefaultHeaders();

        if(endpoint.includes('saida')){
            this.buildURL(`${endpoint}/${form_data['id']}`);
        }else{
            this.buildURL(`${endpoint}/add`);
        }

        delete form_data['endpoint'];
        delete form_data['id'];
        delete form_data['form_data'];

        this.setBody(form_data);
        
        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body
        })

    }

    // CHANGE ANY RECORD FROM ANY ENDPOINT
    saveData(data){

        const { endpoint, form_data } = data;

        this.setDefaultHeaders();
        this.buildURL(`${endpoint}/save/${form_data.id}`);

        delete form_data['endpoint'];
        delete form_data['id'];
        delete form_data['form_data'];

        this.setBody(form_data);
        
        return fetch(this.url, {
            method : 'PUT',
            headers : this.headers,
            body : this.body
        })

    }

    // DELETE ANY RECORD FROM ANY ENDPOINT
    deleteItem(data){

        if(!data){
            console.error('Unknow id to delete record', data);
            return false;
        }

        if(!Object.keys(data).includes('id')){
            console.error('Unknow id to delete record', data);
            return false;
        }

        this.setDefaultHeaders();
        this.buildURL(`${data.endpoint}/del/${data.id}`);
        
        return fetch(this.url, {
            method : 'DELETE',
            headers : this.headers
        })

    }

    // GET OPTIONS TO HTML SELECTS
    getOptions(name){

        let url = '';

        if(name == ''){
            url = 'produtos'
        }else if (name == 'caixa' || name == 'formas_pagamentos' || name == 'fornecedores' || name == 'clientes'){
            url = name;
        }else{
            url = `produtos/${name}`
        }

        this.setDefaultHeaders();
        this.buildURL(url);

        console.log(this.url, this.body);

        return fetch(this.url, {
            method : 'GET',
            headers : this.headers,
        })

    }

    searchData(data){

        const { endpoint, search } = data;

        this.setDefaultHeaders();
        this.buildURL(`${endpoint}/search/${search}`);
        
        return fetch(this.url, {
            method : 'GET',
            headers : this.headers
        })

    }

    printData(data){

        const { endpoint, form_data } = data;
        const without_type_routes = ['vendas', 'ordem_servico', 'produtos', 'estoque_material_producao', 'recibo']

        this.setDefaultHeaders();

        if(without_type_routes.includes(endpoint)){
            this.buildURL(`relatorios/${endpoint}`);
        }else{
            this.buildURL(`relatorios/${endpoint}/${form_data.type}`);
            delete form_data['type'];
        }

        delete form_data['endpoint'];
        delete form_data['form_data'];

        this.setBody(form_data);
        
        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body
        })

    }

    caixa(abrir_fechar, caixa_id){
        
        let url = `caixa/${abrir_fechar}/${caixa_id}`;

        this.setDefaultHeaders();
        this.buildURL(url);

        return fetch(this.url, {
            method : 'GET',
            headers : this.headers,
        })

    }

    generateBarcodes(produtos){

        this.setDefaultHeaders();
        this.buildURL('etiquetas/imprimir');

        console.log('produtos', produtos);

        this.setBody({ produtos : produtos });
        
        return fetch(this.url, {
            method : 'POST',
            headers : this.headers,
            body : this.body
        })

    }

    logout(){
        
        this.setDefaultHeaders();
        this.buildURL('usuarios/logout');

        return fetch(this.url, {
            method : 'GET',
            headers : this.headers,
        })

    }

}

export { Api }