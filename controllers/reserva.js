// Bibliotecas
import { Op } from 'sequelize';
import { addDays, subDays, format } from 'date-fns';

// Modelos
import '../models/relacionamentos.js';
import Reserva from '../models/reserva.js';
import Usuario from '../models/usuario.js';
import Exemplar from '../models/exemplar.js';
import Emprestimo from '../models/emprestimo.js';
import Multa from '../models/multa.js';

// Controladores
import util from './util.js';
import emprestimo from './emprestimo.js';
import exemplar from './exemplar.js';
import multa from './multa.js';

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

/**
 * Verifica se um status fornecido é válido para reservas.
 *
 * @param {string} status - O status a ser verificado. Deve ser uma string.
 * @returns {Promise<boolean>} Retorna uma Promise que resolve para `true` se o status for válido, ou `false` caso contrário.
 *
 * @description
 * Esta função verifica se o `status` passado existe na lista de valores válidos definidos no modelo `Reserva`.
 */
const isStatusValido = async (status) => {
    if (typeof (status) == 'string') {
        const statusValidos = await Reserva.getAttributes().status.values;
        return statusValidos.includes(status);
    }

    return false;
}

// Funções externas

const listar = async (req, res) => {

    try {
        const reservas = await Reserva.findAll();

        if (reservas.length > 0) {
            return res.status(200).json(reservas);
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
        // Verifica se o ID da reserva foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID da reserva não informado!'
            });
        }
        const id = req.params.id;

        // Verifica se a reserva existe
        const reservaExistente = await Reserva.findByPk(id);
        if (!reservaExistente) {
            return res.status(404).json({
                mensagem: `Reserva com ID ${id} não encontrada!`
            });
        }

        return res.status(200).json(reservaExistente.dataValues);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const inserir = async (req, res) => {
    try {
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
            data.data_prevista_devolucao = addDays(new Date(data.data_reserva), util.dias_emprestimo);
        }

        const situacaoDisponivel = 'Disponível'; await exemplar.isSituacaoValida('Disponível') ? 'Disponível' : null;
        const situacaoEmprestado = 'Emprestado'; await exemplar.isSituacaoValida('Emprestado') ? 'Emprestado' : null;

        if (!await exemplar.isSituacaoValida('Disponível') || !await exemplar.isSituacaoValida('Emprestado')) {
            return res.status(404).json({
                mensagem: `Status de exemplares ${situacaoDisponivel} ou ${situacaoEmprestado} não encontrados`
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

        // Verificar se usuário tem pendências financeiras
        const multaStatusAberta = 'A';

        if (!await multa.isStatusValido(multaStatusAberta)) {
            return res.status(404).json({
                mensagem: `Nenhuma multa com status '${multaStatusAberta}' foi encontrada para o usuário`,
                erro: `Status '${multaStatusAberta}' não existe nas configurações de multas`
            });
        }
        const multaAberta = await Multa.findOne(
            {
                where: {
                    id_usuario: data.id_usuario,
                    status: multaStatusAberta
                }
            }
        );

        if (multaAberta) {
            return res.status(409).json({
                mensagem: `Usuário não pode ter pendências financeiras ao criar reservas`
            });
        }

        const novaReserva = await Reserva.create(data);

        return res.status(201).json(novaReserva);

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {

    try {
        // Verifica se o ID da reserva foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID da reserva não informado!'
            });
        }
        const id = req.params.id;

        // Verifica se a reserva existe
        const reservaExistente = await Reserva.findByPk(id);
        if (!reservaExistente) {
            return res.status(404).json({
                mensagem: `Reserva com ID ${id} não encontrada!`
            });
        }

        const permittedColumns = await util.permittedColumns(Reserva.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns);

        if(data.hasOwnProperty('status')){
            return res.status(400).json({
                mensagem: `Status da reserva não pode ser alterado manualmente. Use o endpoint apropriado para isso.`
            });
        }

        // Se usuário foi informado, verifica se existe
        if (data.id_usuario) {
            const usuarioExistente = await Usuario.findByPk(data.id_usuario);
            if (!usuarioExistente) {
                return res.status(404).json({
                    mensagem: `Usuário com ID ${data.id_usuario} não encontrado!`
                });
            }
        }

        // Se exemplar foi informado, verifica se existe
        if (data.id_exemplar) {
            const exemplarExistente = await Exemplar.findByPk(data.id_exemplar);
            if (!exemplarExistente) {
                return res.status(404).json({
                    mensagem: `Exemplar com ID ${data.id_exemplar} não encontrado!`
                });
            }

            // Redefine datas de reserva

            data.data_reserva = data.data_reserva || reservaExistente.dataValues.data_reserva;
            data.data_prevista_devolucao = data.data_prevista_devolucao || reservaExistente.dataValues.data_prevista_devolucao;

            // Verifica se situações existem
            const situacaoDisponivel = await exemplar.isSituacaoValida('Disponível') ? 'Disponível' : null;
            const situacaoEmprestado = await exemplar.isSituacaoValida('Emprestado') ? 'Emprestado' : null;
            if (!situacaoDisponivel || !situacaoEmprestado) {
                console.log(situacaoDisponivel);
                console.log(situacaoEmprestado);
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
        }

        // Atualiza a reserva
        const [reservaLinhasAtualizadas] = await Reserva.update(data, {
            where: { id }
        });

        if (reservaLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: `Reserva com ID ${id} atualizada com sucesso!`
            });
        }

        throw new Error("Reserva não atualizada");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const cancelar = async (req, res) => {
    try {
        // Verifica se o ID da reserva foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID da reserva não informado!'
            });
        }
        const id = req.params.id;

        // Verifica se a reserva existe
        const reservaExistente = await Reserva.findByPk(id);
        if (!reservaExistente) {
            return res.status(404).json({
                mensagem: `Reserva com ID ${id} não encontrada!`
            });
        }

        // Verificando status de aberta
        const reservaStatusAberta = 'Aberta';
        if(!await isStatusValido(reservaStatusAberta)){
            return res.status(404).json({
                mensagem: `Status ${reservaStatusAberta} não encontrado`
            });
        }

        // Validando se reserva está aberta
        if(reservaExistente.dataValues.status != reservaStatusAberta){
            return res.status(409).json({
                mensagem: `Apenas reservas abertas podem ser canceladas`
            });
        }

        // Verifica se o status cancelado existe
        const reservaStatusCancelado = 'Cancelada';

        if(!await isStatusValido(reservaStatusCancelado)){
            return res.status(404).json({
                mensagem: `Status ${reservaStatusCancelado} não encontrado`
            });
        }

        const data = {
            status: reservaStatusCancelado
        };

        const [reservaLinhasAtualizadas] = await Reserva.update(data, {
            where: { id }
        });

        if(reservaLinhasAtualizadas > 0){
            return res.status(200).json({
                mensagem: `Reserva cancelada com sucesso`
            });
        }

        throw new Error("Reserva não cancelada");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const excluir = async (req, res) => {
    try {
        // Verifica se ID foi passado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: `ID não informado`
            });
        }
        const id = req.params.id;
        // Verifica se o ID passado é um número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID não é um número: ${typeof (id)}`
            });
        }
        // Verifica se existe
        const reservaExistente = await Reserva.findByPk(id);
        if (!reservaExistente) {
            return res.status(409).json({
                mensagem: `Reserva não encontrada`
            });
        }

        // Verifica se existe um empréstimo criado com esta reserva
        const emprestimoExistente = await Emprestimo.findOne({
            where: {
                id_reserva: reservaExistente.dataValues.id
            }
        })

        if (emprestimoExistente) {
            return res.status(409).json({
                mensagem: `Não é possível deletar reserva pois já existe um empréstimo com esta reserva`
            });
        }

        const reservaLinhasExcluidas = await Reserva.destroy({
            where: { id }
        });

        if (reservaLinhasExcluidas > 0) {
            return res.status(200).json({
                mensagem: `Reserva excluída com sucesso`
            });
        }

        throw new Error("Reserva não excluída");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { selecionar, inserir, alterar, listar, excluir, isStatusValido, conflitoReserva, cancelar };