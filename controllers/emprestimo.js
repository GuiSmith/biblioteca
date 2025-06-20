// Bibliotecas
import { addDays, subDays, format } from 'date-fns';
import { Op } from 'sequelize';

// Modelos
import Emprestimo from '../models/emprestimo.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';
import Exemplar from '../models/exemplar.js';
import Reserva from '../models/reserva.js';
import Multa from '../models/multa.js';

// Controladores
import util from './util.js';
import exemplar from './exemplar.js';
import reserva from './reserva.js';
import multa from './multa.js';

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

/**
 * @param {string} status - Status do empréstimo
 * @returns {boolean} - Retorna true se o status for válido, false caso contrário
 * @description Verifica se o status do empréstimo é válido
 */
const statusEmprestimoValido = (status) => {
    const statusValidos = Emprestimo.getAttributes().status.values;
    return statusValidos.includes(status);
};

// Funções externas

const listar = async (req, res) => {
    try {
        const emprestimos = await Emprestimo.findAll();

        if (emprestimos.length > 0) {
            return res.status(200).json(emprestimos);
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
                mensagem: 'ID não informado'
            });
        }
        const id = req.params.id;

        // Verificar se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID deve ser um número: ${typeof (req.params.id)}`
            });
        }

        // Verificar se ID existe
        const emprestimoExistente = await Emprestimo.findByPk(id);

        if (!emprestimoExistente) {
            return res.status(404).json({
                mensagem: 'Empréstimo não encontrado',
            });
        }

        return res.status(200).json(emprestimoExistente);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const inserir = async (req, res) => {

    // Iniciar transação para criar empréstimo e mudar status do exemplar
    const transaction = await Emprestimo.sequelize.transaction();

    try {
        const naturalRequiredColumns = await util.requiredColumns(Emprestimo.getTableName());
        const requiredColumns = naturalRequiredColumns.filter(column => !['data_emprestimo','data_prevista_devolucao'].includes(column));
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
        if (!util.isNumber(data.id_usuario)) {
            return res.status(400).json({
                mensagem: `ID do usuário deve ser um número: ${typeof (data.id_usuario)}`
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
        if (!util.isNumber(data.id_exemplar)) {
            return res.status(400).json({
                mensagem: `ID do exemplar deve ser um número: ${typeof (data.id_exemplar)}`
            });
        }

        // Validar se exemplar existe
        const exemplarExistente = await Exemplar.findByPk(data.id_exemplar);
        if (!exemplarExistente) {
            return res.status(404).json({
                mensagem: `Exemplar não encontrado`
            });
        }

        // Validar se livro do exemplar existe
        const livroExistente = await Livro.findByPk(exemplarExistente.dataValues.id_livro);
        if (!livroExistente) {
            return res.status(404).json({
                mensagem: `Livro do exemplar não encontrado: ID ${exemplarExistente.dataValues.id_livro}`
            });
        }

        // Validar se livro do exemplar está ativo
        if (!livroExistente.dataValues.ativo) {
            return res.status(409).json({
                mensagem: `Livro do exemplar inativo`
            });
        }

        // Validar se exemplar está disponível
        const situacaoDisponivel = 'Disponível';
        if (!exemplar.isSituacaoValida(situacaoDisponivel)) {
            return res.status(404).json({
                mensagem: `Não foi possível verificar situação de exemplar`,
                detalhes: `Situação ${situacaoDisponivel} não existe nas configurações de Exemplar`
            });
        }
        if (exemplarExistente.dataValues.situacao != situacaoDisponivel) {
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

        if (emprestimoPendente) {
            return res.status(409).json({
                mensagem: `Usuário possui empréstimos pendentes`
            });
        }

        // Validar se pode usar reserva
        if (data.hasOwnProperty('id_reserva')) {
            // Validar se status de reserva existe
            const reservaStatusAberta = 'Aberta';
            if (!reserva.isStatusValido(reservaStatusAberta)) {
                return res.status(404).json({
                    mensagem: `Status ${reservaStatusAberta} não encontrado para Reservas`
                })
            }

            const reservaExistente = await Reserva.findOne({
                where: {
                    id: data.id_reserva,
                    id_usuario: data.id_usuario,
                    id_exemplar: data.id_exemplar,
                    status: reservaStatusAberta
                }
            });

            if (!reservaExistente) {
                return res.status(404).json({
                    mensagem: `Reserva não encontrada`
                });
            }
            if (reservaExistente.dataValues.status != reservaStatusAberta) {
                return res.status(409).json({
                    mensagem: `Reserva não está aberta para empréstimo: ${reservaExistente.dataValues.situacao}`
                });
            }

        }

        // Verifica se os campos de data são válidos
        const dateColumns = await util.dateColumns(Emprestimo);

        for (const column of dateColumns) {
            if (data.hasOwnProperty(column)) {
                if (!util.validarData(data[column])) {
                    return res.status(400).json({
                        mensagem: `Data inválida para o campo ${column}`,
                        data: {
                            [column]: data[column],
                        },
                    });
                }
            }
        }

        // Insere data de empréstimo como hoje se não foi informada
        if(!data.hasOwnProperty('data_emprestimo')){
            data.data_emprestimo = format(new Date(), 'yyyy-MM-dd');
            console.log(data.data_emprestimo);
        }

        // Verifica se a data de devolução é maior que a data de empréstimo
        if (data.hasOwnProperty('data_devolucao')) {
            if (new Date(data.data_devolucao) < new Date(data.data_emprestimo)) {
                return res.status(400).json({
                    mensagem: `Data de devolução deve ser maior que a data de empréstimo`,
                });
            }
        }
        // Verifica se a data prevista de devolução é maior que a data de empréstimo
        if (new Date(data.data_prevista_devolucao) < new Date(data.data_emprestimo)) {
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que a data de empréstimo`,
            });
        }

        // Verifica se a data prevista de devolução é maior que hoje
        if(new Date(data.data_prevista_devolucao) < new Date()){
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que hoje`,
            });
        }

        data.data_prevista_devolucao = data.data_prevista_devolucao || addDays(data.data_emprestimo, util.dias_emprestimo);

        // Criar empréstimo
        const novoEmprestimo = await Emprestimo.create(data, { transaction });

        // Validar se situação de exemplar existe
        const situacaoEmprestado = 'Emprestado';
        if (!exemplar.isSituacaoValida(situacaoEmprestado)) {
            throw new Error("Situação de exemplar inválida");
        }

        // Mudar status do exemplar para "Emprestado"
        await Exemplar.update({ situacao: situacaoEmprestado }, {
            where: { id: data.id_exemplar },
            transaction
        });

        // Mudar status da reserva para Finalizado
        if (data.hasOwnProperty('id_reserva')) {
            const reservaStatusFinalizado = 'Finalizado';
            if (!reserva.isStatusValido(reservaStatusFinalizado)) {
                throw new Error("Situação de reserva inválida");
            }
            await Reserva.update({ status: reservaStatusFinalizado }, {
                where: { id: data.id_reserva },
                transaction
            });
        }

        // Confirmar transação
        await transaction.commit();
        return res.status(201).json(novoEmprestimo.dataValues);
    } catch (error) {
        // Se ocorrer erro, reverter transação
        await transaction.rollback();

        return res.status(500).json({
            mensagem: `Erro interno`,
            error: error.message
        });
    }
};

const alterar = async (req, res) => {

    try {
        // Verificar se ID foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID não informado'
            });
        }
        const id = req.params.id;

        // Verificar se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID deve ser um número: ${typeof (req.params.id)}`
            });
        }

        // Verificar se ID existe
        const emprestimoExistente = await Emprestimo.findByPk(id);
        if (!emprestimoExistente) {
            return res.status(404).json({
                mensagem: 'Empréstimo não encontrado',
                id: id
            });
        }

        // Filtrando dados
        const permittedColumns = await util.permittedColumns(Emprestimo.getTableName());
        const prohibitedColumns = ['status','id_exemplar','id_reserva','id_usuario'];
        const allowedColumns = permittedColumns.filter(column => !prohibitedColumns.includes(column));

        const data = util.filterObjectKeys(req.body, allowedColumns);

        if (Object.keys(data).length == 0) {
            return res.status(400).json({
                mensagem: 'Nenhum dado para alterar',
                dados: data,
            });
        }

        // Verifica se os campos de data são válidos
        const dateColumns = await util.dateColumns(Emprestimo);

        for (const column of dateColumns) {
            if (data.hasOwnProperty(column)) {
                if (!util.validarData(data[column])) {
                    return res.status(400).json({
                        mensagem: `Data inválida para o campo ${column}`,
                        data: data[column],
                    });
                }
            }
        }

        const dataEmprestimo = data.hasOwnProperty('data_emprestimo') ? data.data_emprestimo : emprestimoExistente.dataValues.data_emprestimo;
        
        const dataPrevistaDevolucao = data.hasOwnProperty('data_prevista_devolucao') ? data.data_prevista_devolucao : emprestimoExistente.dataValues.data_prevista_devolucao;

        // Checando se data de devolução é maior que data de empréstimo
        if(data.hasOwnProperty('data_devolucao')){
            if (new Date(data.data_devolucao) < new Date(dataEmprestimo)) {
                return res.status(400).json({
                    mensagem: `Data de devolução deve ser maior que a data de empréstimo`,
                    data_devolucao: data.data_devolucao,
                    data_emprestimo: data.data_emprestimo
                });
            }
        }

        // Verifica se a data prevista de devolução é maior que a data de empréstimo
        if (new Date(dataPrevistaDevolucao) < new Date(dataEmprestimo)) {
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que a data de empréstimo`,
                data_prevista_devolucao: data.data_prevista_devolucao,
                data_emprestimo: data.data_emprestimo
            });
        }

        // Verifica se a data prevista de devolução é maior que hoje
        if(new Date(dataPrevistaDevolucao) < new Date()){
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que hoje`,
            });
        }

        const [emprestimoLinhasAlteradas] = await Emprestimo.update(data, {
            where: { id }
        });

        if (emprestimoLinhasAlteradas > 0) {
            return res.status(200).json({
                mensagem: `Empréstimo ${id} alterado com sucesso`,
            });
        }

        throw new Error("Empréstimo não atualizado");
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }

};

const devolver = async (req, res) => {

    // Iniciando transação
    const transaction = await Emprestimo.sequelize.transaction();

    try {
        // Verificar se ID foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID não informado'
            });
        }
        const id = req.params.id;

        // Verificar se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID deve ser um número: ${typeof (req.params.id)}`
            });
        }

        // Verificar se ID existe
        const emprestimoExistente = await Emprestimo.findByPk(id);
        if (!emprestimoExistente) {
            return res.status(404).json({
                mensagem: 'Empréstimo não encontrado',
                id: id
            });
        }

        // Verificar se o status de emprestado existe
        const statusEmprestado = 'Emprestado';
        if (!statusEmprestimoValido(statusEmprestado)) {
            return res.status(404).json({
                mensagem: `Status ${statusEmprestado} não encontrado para Empréstimos`
            })
        }

        // Verificar se já foi devolvido
        if (emprestimoExistente.dataValues.status != statusEmprestado) {
            return res.status(409).json({
                mensagem: 'Empréstimo já devolvido',
                id: id
            });
        }

        const dataDevolucao = format(new Date(), 'yyyy-MM-dd');

        // Checando se o status de devolvido existe
        const statusDevolvido = 'Devolvido';
        if (!statusEmprestimoValido(statusDevolvido)) {
            return res.status(404).json({
                mensagem: `Status ${statusDevolvido} não encontrado para Empréstimos`
            })
        }

        const data = {
            data_devolucao: dataDevolucao,
            status: statusDevolvido
        };

        // Atualizando empréstimo
        const [emprestimoLInhasAfetadas] = await Emprestimo.update(data, {
            where: { id },
            transaction
        });

        if (emprestimoLInhasAfetadas == 0) {
            throw new Error("Empréstimo não devolvido");
        }

        // Buscando exemplar
        const exemplarAtualizado = await Exemplar.findOne({
            where: { id: emprestimoExistente.dataValues.id_exemplar },
            transaction
        });

        // Verificando se o exemplar existe
        if (exemplarAtualizado) {

            // Verificando se o status de disponível existe
            const situacaoDisponivel = 'Disponível';
            if (!exemplar.isSituacaoValida(situacaoDisponivel)) {
                throw new Error("Situação de exemplar inválida");
            }

            // Atualizando status do exemplar para "Disponível"
            const exemplarLinhasAfetadas = await Exemplar.update({ situacao: situacaoDisponivel }, {
                where: { id: exemplarAtualizado.dataValues.id },
                transaction
            });

            if (exemplarLinhasAfetadas == 0) {
                throw new Error("Erro ao atualizar exemplar");
            }
        }

        await transaction.commit();

        return res.status(200).json({
            mensagem: 'Empréstimo devolvido com sucesso',
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const renovar = async (req, res) => {

    try {
        // Verificar se ID foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID não informado'
            });
        }
        const id = req.params.id;

        // Verificar se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID deve ser um número: ${typeof (req.params.id)}`
            });
        }

        // Verificar se ID existe
        const emprestimoExistente = await Emprestimo.findByPk(id);
        if (!emprestimoExistente) {
            return res.status(404).json({
                mensagem: 'Empréstimo não encontrado',
                id: id
            });
        }

        // Verificar se o status de emprestado existe
        const statusEmprestado = 'Emprestado';
        if (!statusEmprestimoValido(statusEmprestado)) {
            return res.status(404).json({
                mensagem: `Status ${statusEmprestado} não encontrado para Empréstimos`
            })
        }

        // Verificar se já foi devolvido
        if (emprestimoExistente.dataValues.status != statusEmprestado) {
            return res.status(409).json({
                mensagem: 'Empréstimo já devolvido',
                id: id
            });
        }

        // Verificar se o exemplar do empréstimo existe
        const exemplarExistente = await Exemplar.findByPk(emprestimoExistente.dataValues.id_exemplar);
        if (!exemplarExistente) {
            return res.status(404).json({
                mensagem: `Exemplar não encontrado`
            });
        }

        // Verificar se o status de reserva existe
        const reservaStatusAberta = 'Aberta';
        if (!reserva.isStatusValido(reservaStatusAberta)) {
            return res.status(404).json({
                mensagem: `Status ${reservaStatusAberta} não encontrado para Reservas`
            })
        }

        // Verificar se já existe reserva para este exemplar (use reserva.conflitoReserva())
        const reservasExistentes = await Reserva.findAll({
            where: {
                id_exemplar: emprestimoExistente.dataValues.id_exemplar,
                status: reservaStatusAberta
            }
        });

        const dataHoje = format(new Date(), 'yyyy-MM-dd');
        const data = {};
        data.data_prevista_devolucao = format(addDays(dataHoje, util.dias_emprestimo), 'yyyy-MM-dd');

        for (const reservaExistente of reservasExistentes) {
            // Verificando conflitos de reservas
            const conflito = await reserva.conflitoReserva(emprestimoExistente.dataValues.id_exemplar, dataHoje, data.data_prevista_devolucao, emprestimoExistente.dataValues.id_reserva);

            if (conflito) {
                return res.status(409).json({
                    mensagem: `Não é possível renovar, exemplar já resevado`,
                    reserva: reservaExistente.dataValues
                });
            }
        }

        // Verificar se este empréstimo já teve 2 renovações (use util.dias_renovacao)
        if (emprestimoExistente.dataValues.quantidade_renovacoes >= util.maximo_renovacoes) {
            return res.status(409).json({
                mensagem: `Máximo de ${util.maximo_renovacoes} renovações atingidas para este empréstimo!`
            });
        }

        // Verificar status de multa aberta
        const multaStatusAberta = 'A';
        if (!multa.isStatusValido(multaStatusAberta)) {
            return res.status(404).json({
                mensagem: `Nenhuma multa com status '${multaStatusAberta}' foi encontrada`
            });
        }

        // Verificar se usuário tem pendềncias financeiras
        const multaAberta = await Multa.findOne({
            where: {
                id_usuario: emprestimoExistente.dataValues.id_usuario,
                status: multaStatusAberta
            }
        });

        data.quantidade_renovacoes = emprestimoExistente.dataValues.quantidade_renovacoes + 1;

        // Realizando renovação
        const [renovacaoLinhasAfetadas] = await Emprestimo.update(data, {
            where: { id }
        });

        if (renovacaoLinhasAfetadas > 0) {
            return res.status(200).json({
                mensagem: `Renovação realizada com sucesso`,
            });
        }

        throw new Error("Renovação não realizada");
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

export default { inserir, selecionar, conflitoEmprestimo, alterar, devolver, listar, renovar };