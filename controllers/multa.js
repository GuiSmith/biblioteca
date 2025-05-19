// Bibliotecas

// Modelos
import '../models/relacionamentos.js';
import Multa from '../models/multa.js';
import Usuario from '../models/usuario.js';
import Emprestimo from '../models/emprestimo.js';

// Controladores
import util from './util.js';

// Funções utilitárias

/**
 * Verifica se um status fornecido é válido para multas.
 *
 * @param {string} status - O status a ser verificado. Deve ser uma string.
 * @returns {Promise<boolean>} Retorna uma Promise que resolve para `true` se o status for válido, ou `false` caso contrário.
 *
 * @description
 * Esta função verifica se o `status` passado existe na lista de valores válidos definidos no modelo `Multa`.
 */
const isStatusValido = (status) => {
	if (typeof (status) == 'string') {
		const statusValidos = Multa.getAttributes().status.values;
		return statusValidos.includes(status);
	}

	return false;
}

// Funções externas

const listar = async (req, res) => {

	try {
		const multas = await Multa.findAll();

		if (multas.length > 0) {
			return res.status(200).json(multas);
		}

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({
			mensagem: `Erro interno`,
			error
		});
	}
};

const selecionar = async (req, res) => {
	try {
		// Verificar se ID foi informado
		if (!req.params.id) {
			return res.status(400).json({
				mensagem: `Informe um ID para selecionar multa`
			});
		}
		const id = req.params.id;
		// Verificar se ID é número
		if (!util.isNumber(id)) {
			return res.status(400).json({
				mensagem: `ID informado não é um número`
			});
		}
		// Verificar se registro existe
		const multaExistente = await Multa.findByPk(id);
		if (!multaExistente) {
			return res.status(404).json({
				mensagem: `Multa não encontrada!`,
				id
			});
		}

		return res.status(200).json(multaExistente.dataValues);
	} catch (error) {
		return res.status(500).json({
			mensagem: `Erro interno`,
			error
		});
	}
};

const inserir = async (req, res) => {

	try {
		// Filtrando dados
		const requiredColumns = await util.requiredColumns(Multa.getTableName());
		const permittedColumns = await util.permittedColumns(Multa.getTableName());

		const data = util.filterObjectKeys(req.body, permittedColumns);

		// Verificando se dados obrigatórios foram passados
		if (!util.keysMatch(data, requiredColumns)) {
			return res.status(400).json({
				mensagem: `Dados obrigatórios não informados`,
				dados_obrigatorios: requiredColumns,
				dados_informados: data
			});
		}

		// Verificando se valor é maior que 0
		if (data.valor <= 0) {
			return res.status(400).json({
				mensagem: `Valor precisa ser maior que 0`,
				data
			});
		}

		// Verificando se ID de usuário é número
		if (!util.isNumber(data.id_usuario)) {
			return res.status(400).json({
				mensagem: `ID do usuário deve ser do tipo número`
			});
		}

		// Verificando se usuário existe
		const usuarioExistente = await Usuario.findByPk(data.id_usuario);
		if (!usuarioExistente) {
			return res.status(404).json({
				mensagem: `Usuário com ID ${data.id_usuario} não encontrado`
			});
		}

		// Validando empréstimo, se informado
		if (data.hasOwnProperty('id_emprestimo')) {
			// Verificando se ID de usuário é número
			if (!util.isNumber(data.id_emprestimo)) {
				return res.status(400).json({
					mensagem: `ID do empréstimo deve ser do tipo número`
				});
			}

			// Verificando se usuário existe
			const emprestimoExistente = await Emprestimo.findByPk(data.id_emprestimo);
			if (!emprestimoExistente) {
				return res.status(404).json({
					mensagem: `Empréstimo com ID ${data.id_emprestimo} não encontrado`
				});
			}
		}

		// Validando se data de vencimento é válida
		if (!util.validarData(data.data_vencimento)) {
			return res.status(400).json({
				mensagem: `Data ${data.data_vencimento} inválida`
			});
		}

		// Validando status
		if (data.hasOwnProperty('status') && !await isStatusValido(data.status)) {
			return res.status(400).json({
				mensagem: `Status ${data.status} não encontrado para multas`
			});
		}

		// Validando data de pagamento, se informado
		if (data.hasOwnProperty('data_pagamento') && !util.validarData(data.data_pagamento)) {
			return res.status(400).json({
				mensagem: `Data ${data.data_pagamento} inválida`
			});
		}

		// Inserindo registro
		const novaMulta = await Multa.create(data);

		return res.status(201).json(novaMulta);

	} catch (error) {
		return res.status(500).json({
			mensagem: `Erro interno`,
			error
		});
	}
};

const alterar = async (req, res) => {
	try {
		// Verificando se ID foi passado
		if (!req.params.id) {
			return res.status(400).json({
				mensagem: `ID não informado`
			});
		}
		const id = req.params.id;
		// Verificando se o ID é um número
		if (!util.isNumber(id)) {
			return res.status(400).json({
				mensagem: `ID ${id} não é um número: ${typeof (id)}`
			});
		}

		// Verificando se multa existe
		const multaExistente = await Multa.findByPk(id);
		if (!multaExistente) {
			return res.status(404).json({
				mensagem: `Multa não existente`
			});
		}

		// Filtrando dados
		const permittedColumns = await util.permittedColumns(Multa.getTableName());
		const data = util.filterObjectKeys(req.body, permittedColumns);

		// Validando se há dados a serem alterados
		if (Object.keys(data).length == 0) {
			return res.status(400).json({
				mensagem: `Nenhum dado informado para alteração`
			});
		}

		// Verificando se valor é maior que 0
		if (data.hasOwnProperty('valor') && data.valor <= 0) {
			return res.status(400).json({
				mensagem: `Valor precisa ser maior que 0`,
				data
			});
		}

		// Validando usuário, se foi informado
		if (data.hasOwnProperty('id_usuario')) {
			// Verificando se ID de usuário é número
			if (!util.isNumber(data.id_usuario)) {
				return res.status(400).json({
					mensagem: `ID do usuário deve ser do tipo número`
				});
			}

			// Verificando se usuário existe
			const usuarioExistente = await Usuario.findByPk(data.id_usuario);
			if (!usuarioExistente) {
				return res.status(404).json({
					mensagem: `Usuário com ID ${data.id_usuario} não encontrado`
				});
			}
		}

		// Validando empréstimo, se informado
		if (data.hasOwnProperty('id_emprestimo')) {
			// Verificando se ID de usuário é número
			if (!util.isNumber(data.id_emprestimo)) {
				return res.status(400).json({
					mensagem: `ID do empréstimo deve ser do tipo número`
				});
			}

			// Verificando se empréstimo existe
			const emprestimoExistente = await Emprestimo.findByPk(data.id_emprestimo);
			if (!emprestimoExistente) {
				return res.status(404).json({
					mensagem: `Empréstimo com ID ${data.id_emprestimo} não encontrado`
				});
			}
		}

		// Validando data de vencimento, se informado
		if (data.hasOwnProperty('data_vencimento') && !util.validarData(data.data_vencimento)) {
			return res.status(400).json({
				mensagem: `Data ${data.data_vencimento} inválida`
			});
		}

		// Validando data de pagamento, se informado
		if (data.hasOwnProperty('data_pagamento') && !util.validarData(data.data_pagamento)) {
			return res.status(400).json({
				mensagem: `Data ${data.data_pagamento} inválida`
			});
		}

		const [multaLinhasAfetadas] = await Multa.update(data, {
			where: { id }
		});

		if (multaLinhasAfetadas > 0) {
			return res.status(200).json({
				mensagem: `Multa atualizada com sucesso`
			});
		}

		throw new Error("Multa não atualizada");

	} catch (error) {
		return res.status(500).json({
			mensagem: `Erro interno`,
			error
		});
	}
};

const excluir = async (req, res) => {
	try {
		// Verificando se ID foi passado
		if (!req.params.id) {
			return res.status(400).json({
				mensagem: `ID não informado`
			});
		}
		const id = req.params.id;
		// Verificando se o ID é um número
		if (!util.isNumber(id)) {
			return res.status(400).json({
				mensagem: `ID ${id} não é um número: ${typeof (id)}`
			});
		}

		// Verificando se multa existe
		const multaExistente = await Multa.findByPk(id);
		if (!multaExistente) {
			return res.status(404).json({
				mensagem: `Multa não existente`
			});
		}

		const multaLinhasDeletadas = await Multa.destroy({
			where: { id }
		});

		if (multaLinhasDeletadas > 0) {
			return res.status(200).json({
				mensagem: `Multa deletada com sucesso`
			});
		}

		throw new Error("Multa não deletada");

	} catch (error) {
		return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
	}

}

export default { isStatusValido, listar, selecionar, inserir, alterar, excluir };