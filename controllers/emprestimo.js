// Modelos
import Emprestimo from '../models/emprestimo.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';
// Controladores
import util from './util.js';

// Funções utilitárias

/**
 * @param {number} id_exemplar - ID do exemplar
 * @param {*} dataEmprestimo - Data do empréstimo
 * @returns {boolean} - Retorna true se houver conflito de empréstimo, false caso contrário
 * @description Verifica se há conflito de empréstimo para o exemplar na data desejada
 */
const conflitoEmprestimo = async (id_exemplar, dataEmprestimo) => {

    const emprestimo = await Emprestimo.findOne({
        where: {
            id_exemplar,
            data_devolucao: null,
            data_prevista_devolucao: {
                [Op.gt]: dataEmprestimo
            }
        }
    });
    return !!emprestimo;

};

// Funções externas

const inserir = async (req, res) => {

    const requiredColumns = await util.requiredColumns(Emprestimo.getTableName());
    const permittedColumns = await util.permittedColumns(Emprestimo.getTableName());

    const data = data.util.filterObjectKeys(req.body, permittedColumns);

    if (!util.keysMatch(data, requiredColumns)) {
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            dados: data,
            obrigatorios: requiredColumns,
        });
    }

    console.log(data);

    // Validar se usuário existe
    const usuario = await Usuario.findByPk(data.id_usuario);
    if (!usuario) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado',
            id_usuario: data.id_usuario,
        });
    }

};

export default { inserir, conflitoEmprestimo };