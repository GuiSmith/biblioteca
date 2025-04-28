// Bibliotecas
import { addDays, subDays, format } from 'date-fns';
import { Op } from 'sequelize';

// Modelos
import Emprestimo from '../models/emprestimo.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';
import Exemplar from '../models/exemplar.js';
import Reserva from '../models/reserva.js';

// Controladores
import util from './util.js';
import exemplar from './exemplar.js';
import reserva from './reserva.js';

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

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if (!util.keysMatch(data, requiredColumns)) {
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            dados: data,
            obrigatorios: requiredColumns,
        });
    }

    console.log(data);

    // Validar se ID de usuário é número
    if(!util.isNumber(data.id_usuario)){
        return res.status(400).json({
            mensagem: `ID do usuário deve ser um número: ${typeof(data.id_usuario)}`
        });
    }
    // Validar se usuário existe
    const usuario = await Usuario.findByPk(data.id_usuario);
    if (!usuario) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado',
            id_usuario: data.id_usuario,
        });
    }

    // Validar se ID de exemplar é número
    if(!util.isNumber(data.id_exemplar)){
        return res.status(400).json({
            mensagem: `ID do exemplar deve ser um número: ${typeof(data.id_exemplar)}`
        });
    }

    // Validar se exemplar existe
    const exemplarExistente = await Exemplar.findByPk(data.id_exemplar);
    if(!exemplarExistente){
        return res.status(404).json({
            mensagem: `Exemplar não encontrado`
        });
    }

    // Validar se livro do exemplar existe
    const livroExistente = await Livro.findByPk(exemplarExistente.dataValues.id_livro);
    if(!livroExistente){
        return res.status(404).json({
            mensagem: `Livro do exemplar não encontrado: ID ${exemplarExistente.dataValues.id_livro}`
        });
    }

    // Validar se livro do exemplar está ativo
    if(!livroExistente.dataValues.ativo){
        return res.status(409).json({
            mensagem: `Livro do exemplar inativo`
        });
    }

    // Validar se exemplar está disponível
    const situacaoDisponivel = 'Disponível';
    if(!exemplar.isSituacaoValida(situacaoDisponivel)){
        return res.status(404).json({
            mensagem: `Não foi possível verificar situação de exemplar`,
            detalhes: `Situação ${situacaoDisponivel} não existe nas configurações de Exemplar`
        });
    }
    if(exemplarExistente.dataValues.situacao != situacaoDisponivel){
        return res.status(409).json({
            mensagem: `Exemplar não está disponível. Situação: ${exemplarExistente.dataValues.situacao}`
        });
    }

    // Validar se usuário tem algum empréstimo pendente

    const emprestimoPendente = await Emprestimo.findOne({
        where: {
            id_usuario: data.id_usuario,
            data_devolucao: null
        }
    });

    if(emprestimoPendente){
        return res.status(409).json({
            mensagem: `Usuário possui empréstimos pendentes`
        });
    }

    // Validar se pode usar reserva
    if(data.id_reserva){
        const reservaExistente = await Reserva.findOne({
            where: {
                id: data.id_reserva,
                id_usuario: data.id_usuario
            }
        });

        if(!reservaExistente){
            return res.status(404).json({
                mensagem: `Reserva não encontrada`
            });
        }
        const reservaStatusValido = 'Aberta';
        if(!reserva.isStatusValido(reservaStatusValido)){
            return res.status(404).json({
                mensagem: `Status ${reservaStatusValido} não encontrado para Reservas`
            })
        }
        if(reservaExistente.dataValues.status != reservaStatusValido){
            return res.status(409).json({
                mensagem: `Reserva não está aberta para empréstimo: ${reservaExistente.dataValues.situacao}`
            });
        }

    }

    // Verifica se os campos de data são válidos

    data.data_prevista_devolucao = data.data_prevista_devolucao || addDays(data.data_emprestimo, util.dias_emprestimo);

    return await Emprestimo.create(data)
        .then(emprestimo => res.status(201).json(emprestimo))
        .catch(error => res.status(500).json({
            mensagem: `Erro ao inserir empréstimo`,
            erro: error
        }));

};

(async () => {
    const data = '2025-03-10';
    console.log(util.validarData(data));
})();

export default { inserir, conflitoEmprestimo };