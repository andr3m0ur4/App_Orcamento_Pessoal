// Classe do objeto despesa
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == null || this[i] == '') {
				return false
			}
		}
		return true
	}
}

// Classe para criação de índices dinâmicos no Local Storage
class BD {

	constructor() {
		let id = localStorage.getItem('id')

		if (!id) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		
		let id = this.getProximoId()

		localStorage.setItem(`despesa${id}`, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {
		// array de despesas
		let despesas = []

		let id = parseInt(localStorage.getItem('id'))

		// recuperar todas as despesas cadastradas em Local Storage
		for (let i = 1; i <= id; i++) {
			// recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(`despesa${i}`))
			
			// existe a possibilidade de haver índices que foram pulados/removidos
			// nestes casos nós iremos pular esses índices
			if (!despesa) {
				continue
			}

			despesas.push(despesa)
		}

		return despesas
	}
}

let bd = new BD()

// Eventos da página
let caminho = window.location.pathname
let arquivo = extrairArquivo(caminho).arquivo

if (arquivo === 'index.html') {
	document.getElementById('cadastrar').addEventListener('click', cadastrarDespesa, false)
}

if (arquivo === 'consulta.html') {
	document.body.addEventListener('load', carregaListaDespesas, true)
}

// Função para recuperar os dados do formulário de cadastro
function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	if (despesa.validarDados()) {
		//bd.gravar(despesa)
		// dialog de sucesso
		carregarModalSucesso()
	} else {
		// dialog de erro
		carregarModalErro()
	}
}

function carregaListaDespesas() {
	let despesas = bd.recuperarTodosRegistros()

	console.log(despesas)
}

// Função para carregar modal de sucesso
function carregarModalSucesso() {
	document.getElementById('modalCabecalho').className = 'modal-header text-success'
	document.getElementById('modalTitulo').innerHTML = 'Registro inserido com sucesso'
	document.getElementById('modalConteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
	document.getElementById('modalBtn').className = 'btn btn-success'
	document.getElementById('modalBtn').innerHTML = 'Voltar'

	$('#modalRegistraDespesa').modal('show')
}

// Função para carregar modal de erro
function carregarModalErro() {
	document.getElementById('modalCabecalho').className = 'modal-header text-danger'
	document.getElementById('modalTitulo').innerHTML = 'Erro na gravação do registro'
	document.getElementById('modalConteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos!'
	document.getElementById('modalBtn').className = 'btn btn-danger'
	document.getElementById('modalBtn').innerHTML = 'Voltar e corrigir'

	$('#modalRegistraDespesa').modal('show')
}

// Função para extrair nome e extensão do arquivo
function extrairArquivo(caminho){
	caminho	= caminho.replace("/\/g", "/")
	let arquivo = caminho.substring(caminho.lastIndexOf('/') + 1)
	let extensao = arquivo.substring(arquivo.lastIndexOf('.') + 1)
	return {arquivo, extensao}
}
