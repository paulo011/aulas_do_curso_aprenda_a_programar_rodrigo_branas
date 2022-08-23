class Tela{
    constructor(){
        this.janeiro = new Mes("janeiro")

        this.janeiro.adicionarLacamento(new Lancamento('salário','receita', 3000))
        this.janeiro.adicionarLacamento(new Lancamento('aluguel','despesa' ,1000)) 
        this.janeiro.adicionarLacamento(new Lancamento('conta de luz', 'despesa' ,200))
        this.janeiro.adicionarLacamento(new Lancamento('conta de água','despesa' ,100))
        this.janeiro.adicionarLacamento(new Lancamento('internet','despesa' ,100))
        this.janeiro.adicionarLacamento(new Lancamento('transporte','despesa' ,300))
        this.janeiro.adicionarLacamento(new Lancamento('lazer','despesa' ,300))
        this.janeiro.adicionarLacamento(new Lancamento('alimentação','despesa' ,500))
        this.janeiro.adicionarLacamento(new Lancamento("condomínio", "despesa", 300))
        this.janeiro.adicionarLacamento(new Lancamento("Farmácia", "despesa", 100))

        this.fevereiro = new Mes("fevereiro")

        this.fevereiro.adicionarLacamento(new Lancamento('salário','receita', 3000))
        this.fevereiro.adicionarLacamento(new Lancamento('aluguel','despesa' ,1200)) 
        this.fevereiro.adicionarLacamento(new Lancamento('conta de luz', 'despesa' ,250))
        this.fevereiro.adicionarLacamento(new Lancamento('conta de água','despesa' ,100))
        this.fevereiro.adicionarLacamento(new Lancamento('internet','despesa' ,100))
        this.fevereiro.adicionarLacamento(new Lancamento('transporte','despesa' ,500))
        this.fevereiro.adicionarLacamento(new Lancamento('lazer','despesa' ,1000))
        this.fevereiro.adicionarLacamento(new Lancamento('alimentação','despesa' ,400))

        this.ano = new Ano()
        this.ano.adicionarMes(this.janeiro)
        this.ano.adicionarMes(this.fevereiro)
        this.ano.calcularSaldo()

    }

    formatarDinheiro (valor){
        return new Intl.NumberFormat("pt-br", { currency: "BRL", style: 'currency'}).format(valor)
    }

    renderizar (){
        document.querySelector("#app").remove()
        const app = new Div("app") 

        const titulo = new H4 ("Finanças Pessoais")

        app.adicionarElementoFilho(titulo.element)

        const form = new Div('form-lancamento')
        app.adicionarElementoFilho(form.element)
        const mesSelect = new Select("mes")
        for(const mes of this.ano.meses){
            mesSelect.addOption(mes.nome)
        }
        const tipoSelect = new Select("tipo")
        tipoSelect.addOption("receita")
        tipoSelect.addOption("despesa")
        const categoriaInputText = new Input("categoria", "text", "Categoria")
        const valorInputNumber = new Input("valor", "number", "valor")
        const adicionarButton = new Button("botao", "Adicionar Lançamento")
        adicionarButton.addListener(()=> this.adicionarLacamento())
        form.adicionarElementoFilho(mesSelect.element)
        form.adicionarElementoFilho(tipoSelect.element)
        form.adicionarElementoFilho(categoriaInputText.element)
        form.adicionarElementoFilho(valorInputNumber.element)
        form.adicionarElementoFilho(adicionarButton.element)

        const grafico = new Grafico()
        for(const mes of this.ano.meses){
            grafico.adicionarColuna(mes.totalizador.saldo, mes.nome)
        }
        app.adicionarElementoFilho(grafico.element)

        for(const mes of this.ano.meses){
            const nomeDoMes = new H4(mes.nome)
            app.adicionarElementoFilho(nomeDoMes.element)

            const tabelaLancamentos = new Tabela("tabela-lancamentos")
            tabelaLancamentos.addRow("th",["Categoria", "Valor"] )
            for(const lancamento of mes.lancamentos){
                const lancamentoTipo =  this.formatarDinheiro(lancamento.getValorString())
                tabelaLancamentos.addRow("td", [ lancamento.categoria, lancamentoTipo])
            }
            tabelaLancamentos.addRow("th", [ "Total", this.formatarDinheiro(mes.totalizador.saldo)])
            tabelaLancamentos.addRow("th", ["Juros", mes.totalizador.juros !== 0 ? " " + this.formatarDinheiro(mes.totalizador.juros) : "R$ 0"])
            tabelaLancamentos.addRow("th", ["Rendimentos", mes.totalizador.rendimentos !== 0 ? " " +this.formatarDinheiro(mes.totalizador.rendimentos) : "R$ 0"])
            app.adicionarElementoFilho(tabelaLancamentos.element)
        }
        const [body] = document.getElementsByTagName("body")
        body.appendChild(app.element)
    }

    adicionarLacamento(){
        const mes = document.querySelector('#mes').value
        const categoria = document.querySelector("#categoria").value
        const tipo = document.querySelector("#tipo").value
        const valor = document.querySelector('#valor').value
        this.ano.adicionarLancamento(mes, new Lancamento(categoria, tipo, parseFloat(valor)))
        this.ano.calcularSaldo()
        this.renderizar()
        document.querySelector('#valor').value = ""   
        document.querySelector('#categoria').value = "" 
        document.querySelector('#tipo').value = "receita" 
        document.querySelector('#mes').value = this.ano.meses[0].nome
    }
}