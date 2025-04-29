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

/**
 * @param {string} status - Status do empréstimo
 * @returns {boolean} - Retorna true se o status for válido, false caso contrário
 * @description Verifica se o status do empréstimo é válido
 */
const statusEmprestimoValido = (status) => {
    const statusValidos = Emprestimo.getAttributes().status.values;
    return statusValidos.includes(status);
}

// Funções externas

const listar = async (req, res) => {
    return await Emprestimo.findAll()
        .then(emprestimos => res.status(emprestimos.length > 0 ? 200 : 204).json(emprestimos))
        .catch(error => res.status(500).json({
            mensagem: `Erro ao listar empréstimos`,
            erro: error
        }));
}

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
    if (data.id_reserva) {
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
        const reservaStatusValido = 'Aberta';
        if (!reserva.isStatusValido(reservaStatusValido)) {
            return res.status(404).json({
                mensagem: `Status ${reservaStatusValido} não encontrado para Reservas`
            })
        }
        if (reservaExistente.dataValues.status != reservaStatusValido) {
            return res.status(409).json({
                mensagem: `Reserva não está aberta para empréstimo: ${reservaExistente.dataValues.situacao}`
            });
        }

    }

    // Verifica se os campos de data são válidos
    const dateColumns = await util.dateColumns(Emprestimo);

    for (const column of dateColumns) {
        if (data[column]) {
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

    // Verifica se a data de devolução é maior que a data de empréstimo
    if (data.data_devolucao && data.data_emprestimo) {
        if (data.data_devolucao < data.data_emprestimo) {
            return res.status(400).json({
                mensagem: `Data de devolução deve ser maior que a data de empréstimo`,
                data_devolucao: data.data_devolucao,
                data_emprestimo: data.data_emprestimo
            });
        }
    }
    // Verifica se a data prevista de devolução é maior que a data de empréstimo
    if (data.data_prevista_devolucao && data.data_emprestimo) {
        if (data.data_prevista_devolucao < data.data_emprestimo) {
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que a data de empréstimo`,
                data_prevista_devolucao: data.data_prevista_devolucao,
                data_emprestimo: data.data_emprestimo
            });
        }
    }

    data.data_prevista_devolucao = data.data_prevista_devolucao || addDays(data.data_emprestimo, util.dias_emprestimo);

    // Iniciar transação para criar empréstimo e mudar status do exemplar
    const transaction = await Emprestimo.sequelize.transaction();
    try {
        // Criar empréstimo
        const emprestimo = await Emprestimo.create(data, { transaction });
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
        if (data.id_reserva) {
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
        return res.status(201).json({
            mensagem: 'Empréstimo inserido com sucesso',
            emprestimo: emprestimo,
        });
    } catch (error) {
        // Se ocorrer erro, reverter transação
        await transaction.rollback();
        return res.status(500).json({
            mensagem: `Erro ao inserir empréstimo`,
            erro: error
        });
    }
};

const alterar = async (req, res) => {

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

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(Object.keys(data).length == 0) {
        return res.status(400).json({
            mensagem: 'Nenhum dado para alterar',
            dados: data,
        });
    }

    // Validando usuário, se foi enviado
    if (data.id_usuario) {
        // Validar se ID de usuário é número
        if (!util.isNumber(data.id_usuario)) {
            return res.status(400).json({
                mensagem: `ID do usuário deve ser um número: ${typeof (data.id_usuario)}`
            });
        }
        // Validar se usuário existe
        const usuarioExistente = await Usuario.findByPk(data.id_usuario);
        if (!usuarioExistente) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado',
                id_usuario: data.id_usuario,
            });
        }
    }

    // Validando exemplar, se foi enviado
    if (data.id_exemplar) {
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
    }

    // Validar se pode usar reserva
    if (data.id_reserva) {
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
        const reservaStatusValido = 'Aberta';
        if (!reserva.isStatusValido(reservaStatusValido)) {
            return res.status(404).json({
                mensagem: `Status ${reservaStatusValido} não encontrado para Reservas`
            })
        }
        if (reservaExistente.dataValues.status != reservaStatusValido) {
            return res.status(409).json({
                mensagem: `Reserva não está aberta para empréstimo: ${reservaExistente.dataValues.situacao}`
            });
        }

    }

    // Verifica se os campos de data são válidos
    const dateColumns = await util.dateColumns(Emprestimo);

    dateColumns.forEach((column) => {
        if (data[column]) {
            if (!util.validarData(data[column])) {
                return res.status(400).json({
                    mensagem: `Data inválida para o campo ${column}`,
                    data: data[column],
                });
            }
        }
    });

    // Verifica se a data de devolução é maior que a data de empréstimo
    if (data.data_devolucao && data.data_emprestimo) {
        if (data.data_devolucao < data.data_emprestimo) {
            return res.status(400).json({
                mensagem: `Data de devolução deve ser maior que a data de empréstimo`,
                data_devolucao: data.data_devolucao,
                data_emprestimo: data.data_emprestimo
            });
        }
    }
    // Verifica se a data prevista de devolução é maior que a data de empréstimo
    if (data.data_prevista_devolucao && data.data_emprestimo) {
        if (data.data_prevista_devolucao < data.data_emprestimo) {
            return res.status(400).json({
                mensagem: `Data prevista de devolução deve ser maior que a data de empréstimo`,
                data_prevista_devolucao: data.data_prevista_devolucao,
                data_emprestimo: data.data_emprestimo
            });
        }
    }

    // data.data_prevista_devolucao = data.data_prevista_devolucao || addDays(data.data_emprestimo, util.dias_emprestimo);

    return await Emprestimo.update(data, {
        where: { id }
    })
        .then(emprestimo => res.status(200).json({
            mensagem: `Empréstimo ${id} alterado com sucesso`,
        }))
        .catch(error => res.status(500).json({
            mensagem: `Erro ao alterar empréstimo`,
            erro: error
        }));

}

const devolver = async (req, res) => {

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
    // Filtrando dados
    const permittedColumns = await util.permittedColumns(Emprestimo.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    // Verifica se a data de devolução é válida

}

export default { inserir, conflitoEmprestimo, alterar, devolver, listar };