const Carrinho = () => {

    var module = {
        carrinho : null
    };

    module.initCarrinho = () => {

        if(localStorage.getItem('carrinho')===null){
            localStorage.setItem('carrinho', [])
        }

        module.carrinho = module.getCarrinho();

    }

    module.getCarrinho = () => {

        let carrinho = localStorage.getItem('carrinho');

        if(!carrinho){
            return [];
        }

        carrinho = JSON.parse(carrinho);

        return carrinho;

    }

    module.setCarrinho = () => {
        module.carrinho = module.getCarrinho();
    }

    module.addCarrinho = (produto) => {
    
        module.carrinho.push(produto);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        module.setCarrinho();

    }

    module.updCarrinho = (produto_id,quantidade) => {
        
        let newCarrinho = [];

        module.carrinho.forEach(produto => {

            if(produto.id == produto_id){
                //produto.qtd = parseInt(produto.qtd) + parseInt(quantidade);
                produto.qtd = parseInt(quantidade);
            }

            newCarrinho.push(produto);
            module.setCarrinho();

        });

        localStorage.setItem('carrinho', JSON.stringify(newCarrinho));

    }

    module.delCarrinho = (produto_id) => {
        
        let newCarrinho = [];

        module.carrinho.forEach(produto => {

            if(produto.id != produto_id){
                newCarrinho.push(produto);
            }

        });

        localStorage.setItem('carrinho', JSON.stringify(newCarrinho));
        module.setCarrinho();

    }

    module.limparCarrinho = (reload) => {
        localStorage.setItem('carrinho', []);
        reload ? document.location.reload() : null;
    }

    module.checkCarrinho = (produto_id) => {

        let produtosIds = module.carrinho.map(p => { return parseInt(p.id) });

        return Object.values(produtosIds).includes(parseInt(produto_id));

    }

    return module;

};

export { Carrinho };