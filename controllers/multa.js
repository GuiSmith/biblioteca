// Bibliotecas

// Modelos
import '../models/relacionamentos.js';
import Multa from '../models/multa.js';

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
const isStatusValido = async (status) => {
	if(typeof(status) == 'string'){
		const statusValidos = await Multa.getAttributes().status.values;
		return statusValidos.includes(status);
	}

	return false;
}

export default { isStatusValido };