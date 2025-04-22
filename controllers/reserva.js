// Bibliotecas
import { Op } from 'sequelize';
import { addDays, subDays, format } from 'date-fns';

// Modelos
import Reserva from '../models/reserva.js';
import Usuario from '../models/usuario.js';
import Exemplar from '../models/exemplar.js';

// Controladores
import util from './util.js';
import emprestimo from './emprestimo.js';
import exemplar from './exemplar.js';

// Funções utilitárias

/**
 * @param {number} id_exemplar - ID do exemplar 
 * @param {DataType.DATEONLY} data_reserva - Data da reserva
 * @param {DataType.DATEONLY} data_prevista_devolucao - Data prevista da devolução
 * @param {number} id_reserva - Data da reserva
 * @returns {boolean} - Retorna true se houver conflito de reserva, false caso contrário
 * @description Verifica se há conflito de reserva para o exemplar na data desejada
 */
const conflitoReserva = async (id_exemplar, dataReserva, dataPrevistaDevolucao, id_reserva = null) => {
    const dataInicio = new Date(dataReserva);
    const dataFim = new Date(dataPrevistaDevolucao);

    const conflito = await Reserva.findOne({
        where: {
            id_exemplar,
            id: { [Op.ne]: id_reserva },
            status: Reserva.getAttributes().status.defaultValue,
            [Op.or]: [
                { data_reserva: { [Op.between]: [dataInicio, dataFim] } },
                { data_prevista_devolucao: { [Op.between]: [dataInicio, dataFim] } },
                {
                    [Op.and]: [
                        { data_reserva: { [Op.lte]: dataInicio } },
                        { data_prevista_devolucao: { [Op.gte]: dataFim } }
                    ]
                }
            ]
        }
    });
    return !!conflito;
}

// Funções externas

const listar = async (req, res) => {

    return await Reserva.findAll()
        .then(result => res.status(result ? 200 : 204).json(result))
        .catch(error => res.status(500).json({
            mensagem: 'Erro ao listar reservas',
            erro: error
        }));
};

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Reserva.getTableName());
    const permittedColumns = await util.permittedColumns(Reserva.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if (!util.keysMatch(data, requiredColumns)) {
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Verifica se usuário existe
    const usuarioExistente = await Usuario.findByPk(data.id_usuario);

    if (!usuarioExistente) {
        return res.status(404).json({
            mensagem: `Usuário com ID ${data.id_usuario} não encontrado!`
        });
    }

    // Verifica se exemplar existe
    const exemplarExistente = await Exemplar.findByPk(data.id_exemplar);

    if (!exemplarExistente) {
        return res.status(404).json({
            mensagem: `Exemplar com ID ${data.id_exemplar} não encontrado!`
        });
    }

    // Definindo data prevista de devolução se não informada
    if (!data.data_prevista_devolucao) {
        data.data_prevista_devolucao = addDays(data.data_reserva, util.dias_emprestimo);
    }

    const situacaoDisponivel = await exemplar.isSituacaoValida('Disponível') ? 'Disponível' : null;
    const situacaoEmprestado = await exemplar.isSituacaoValida('Emprestado') ? 'Emprestado' : null;

    if (!situacaoDisponivel || !situacaoEmprestado) {
        return res.status(500).json({
            mensagem: 'Erro ao verificar situação do exemplar'
        });
    }

    // Verificar se o exemplar está disponível
    if (exemplarExistente.dataValues.situacao !== situacaoDisponivel) {
        // return res.status(409).json({
        //     mensagem: `Exemplar com ID ${data.id_exemplar} não disponível!`
        // });
        if (exemplarExistente.dataValues.situacao == situacaoEmprestado) {
            // Verificar se o exemplar estará disponível na data desejada de reserva
            const conflitoEmprestimo = await emprestimo.conflitoEmprestimo(data.id_exemplar, data.data_reserva);

            if (conflitoEmprestimo) {
                return res.status(409).json({
                    mensagem: `Exemplar ${data.id_exemplar} ainda estará emprestado nesta data!`,
                });
            } else {
                // Não é possível reservar, pois o exemplar não está disponível
                return res.status(409).json({
                    mensagem: `Exemplar com ID ${data.id_exemplar} não disponível. Situação atual: ${exemplarExistente.dataValues.situacao}!`,
                });
            }
        }
    }

    // Verificar se o exemplar estará disponível na data desejada
    const conflito = await conflitoReserva(data.id_exemplar, data.data_reserva, data.data_prevista_devolucao);
    if (conflito) {
        return res.status(409).json({
            mensagem: `Exemplar já está reservado neste período!`
        });
    }

    /* Testing purposes */

    // return res.status(200).json({
    //     mensagem: 'Exemplar disponível para reserva!',
    //     data: data
    // });

    return await Reserva.create(data)
        .then((reserva) => {
            res.status(201).json(reserva);
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao inserir reserva',
                erro: error
            });
        });
}

const alterar = async (req, res) => {

    // Verifica se o ID da reserva foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'ID da reserva não informado!'
        });
    }
    const id = req.params.id;

    const permittedColumns = await util.permittedColumns(Reserva.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);

    // Verifica se a reserva existe
    const reservaExistente = await Reserva.findByPk(id);
    if (!reservaExistente) {
        return res.status(404).json({
            mensagem: `Reserva com ID ${id} não encontrada!`
        });
    }

    // Verifica se o exemplar existe
    const exemplarExistente = await Exemplar.findByPk(data.id_exemplar || reservaExistente.dataValues.id_exemplar);
    if (!exemplarExistente) {
        return res.status(404).json({
            mensagem: `Exemplar com ID ${data.id_exemplar} não encontrado!`
        });
    }

    // Verifica se o usuário existe
    const usuarioExistente = await Usuario.findByPk(data.id_usuario || reservaExistente.dataValues.id_usuario);
    if (!usuarioExistente) {
        return res.status(404).json({
            mensagem: `Usuário com ID ${data.id_usuario} não encontrado!`
        });
    }

    data.data_reserva = data.data_reserva || reservaExistente.dataValues.data_reserva;
    data.data_prevista_devolucao = data.data_prevista_devolucao || reservaExistente.dataValues.data_prevista_devolucao;

    // Verifica se situações existem
    const situacaoDisponivel = await exemplar.isSituacaoValida('Disponível') ? 'Disponível' : null;
    const situacaoEmprestado = await exemplar.isSituacaoValida('Emprestado') ? 'Emprestado' : null;
    if (!situacaoDisponivel || !situacaoEmprestado) {
        return res.status(500).json({
            mensagem: 'Erro ao verificar situação do exemplar'
        });
    }

    // Verifica se exemplar está disponível
    if (exemplarExistente.dataValues.situacao != situacaoDisponivel) {
        // Verifica se exemplar está emprestado
        if (exemplarExistente.dataValues.situacao == situacaoEmprestado) {
            // Verificar se o exemplar estará disponível na data desejada de reserva
            const conflitoEmprestimo = await emprestimo.conflitoEmprestimo(data.id_exemplar, data.data_reserva);
            if (conflitoEmprestimo) {
                return res.status(409).json({
                    mensagem: `Exemplar ${data.id_exemplar} ainda estará emprestado nesta data!`,
                });
            }
        }
        // Não é possível reservar, pois o exemplar não está disponível
        return res.status(409).json({
            mensagem: `Exemplar com ID ${data.id_exemplar} não disponível. Situação atual: ${exemplarExistente.dataValues.situacao}!`,
        });
    }

    // Verifica se há conflito de reserva para este exemplar
    const conflito = await conflitoReserva(data.id_exemplar, data.data_reserva, data.data_prevista_devolucao, id);
    if (conflito) {
        return res.status(409).json({
            mensagem: `Exemplar já está reservado neste período!`
        });
    }

    return res.status(200).json({ mensagem: "Pronto para atualizar" });

    // Atualiza a reserva
    return await Reserva.update(data, {
        where: { id }
    })
        .then(() => {
            return res.status(200).json({
                mensagem: `Reserva com ID ${id} atualizada com sucesso!`
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao atualizar reserva',
                erro: error
            });
        });
}

export default { inserir, alterar, listar };