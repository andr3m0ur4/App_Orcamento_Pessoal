// Classe do objeto despesa
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = isNaN(parseInt(ano)) ? '' : parseInt(ano)
		this.mes = isNaN(parseInt(mes)) ? '' : parseInt(mes)
		this.dia = isNaN(parseInt(dia)) ? '' : parseInt(dia)
		this.tipo = isNaN(parseInt(tipo)) ? '' : parseInt(tipo)
		this.descricao = descricao
		this.valor = isNaN(parseFloat(valor)) ? '' : parseFloat(valor)
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

			despesa.id = i

			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(d) {
		let despesasFiltradas = this.recuperarTodosRegistros()

		for (let chave in d) {
			if (d[chave] !== '') {
				despesasFiltradas = despesasFiltradas.filter(despesa => despesa[chave] == d[chave])
			}
		}
		
		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)

		carregarModalRemocao()
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
	document.getElementById('pesquisar').addEventListener('click', pesquisarDespesas, false)
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
		bd.gravar(despesa)
		// dialog de sucesso
		carregarModalSucesso()
		limparCampos(ano, mes, dia, tipo, descricao, valor)
	} else {
		// dialog de erro
		carregarModalErro()
	}
}

// Função para carregar a lista de despesas
function carregaListaDespesas(evento, despesas = bd.recuperarTodosRegistros()) {

	// selecionando o elemnto tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	// percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(d => {
		// criando a linha (tr)
		let linha = listaDespesas.insertRow()

		// criar o botão de exclusão
		let btn = document.createElement('button')
		let i = document.createElement('i')
		btn.className = 'btn btn-danger'
		btn.id = `despesa${d.id}`
		btn.onclick = () => { bd.remover(btn.id) }
		btn.append(i)
		i.className = 'fas fa-times'

		// criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		linha.insertCell(1).innerHTML = formatarTipo(d.tipo)
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
		linha.insertCell(4).append(btn)
	})
}

// Função para pesquisar as despesas através de filtro
function pesquisarDespesas() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(false, despesas)
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

// Função para carregar modal de erro
function carregarModalRemocao() {
	document.getElementById('modalCabecalho').className = 'modal-header text-success'
	document.getElementById('modalTitulo').innerHTML = 'Registro excluído com sucesso'
	document.getElementById('modalConteudo').innerHTML = 'Despesa foi removida com sucesso!'
	document.getElementById('modalBtn').className = 'btn btn-success'
	document.getElementById('modalBtn').innerHTML = 'Fechar'
	document.getElementById('modalBtn').onclick = () => { carregaListaDespesas(false) }

	$('#modalRemocaoDespesa').modal('show')
}

// Função para extrair nome e extensão do arquivo
function extrairArquivo(caminho){
	caminho	= caminho.replace("/\/g", "/")
	let arquivo = caminho.substring(caminho.lastIndexOf('/') + 1)
	let extensao = arquivo.substring(arquivo.lastIndexOf('.') + 1)
	return {arquivo, extensao}
}

// Função para ajustar o tipo
function formatarTipo(tipo) {
	switch (tipo) {
		case 1:
			return 'Alimentação'

		case 2:
			return 'Educação'

		case 3:
			return 'Lazer'

		case 4:
			return 'Saúde'

		case 5:
			return 'Transporte'
	}
}

// Função para limpar os campos do formulário
function limparCampos(ano, mes, dia, tipo, descricao, valor) {
	ano.value = ''
	mes.value = ''
	dia.value = ''
	tipo.value = ''
	descricao.value = ''
	valor.value = ''
}
