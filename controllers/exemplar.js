// Modelos
import '../models/relacionamentos.js';
import Exemplar from '../models/exemplar.js';
import Livro from '../models/livro.js';
import Editora from '../models/editora.js';

// Controladores
import util from './util.js';

// Funções utilitárias

/**
 * @param {string} situacao - Situação do exemplar
 * @returns {boolean} - Retorna true se a situação for válida, false caso contrário
 * @description Verifica se a situação do exemplar é válida
 */
const isSituacaoValida = async (situacao) => {
    const situacoesValidas = Exemplar.getAttributes().situacao.values;
    return situacoesValidas.includes(situacao);
}

// Funções externas

const listar = async (req, res) => {
    try {
        const livros = await Livro.findAll({
            raw: true
        });

        const livrosComExemplares = await Promise.all(
            livros.map(async (livro) => {
                const exemplares = await Exemplar.findAll({
                    where: { id_livro: livro.id },
                    raw: true,
                })

                return {
                    ...livro,
                    exemplares
                }
            })
        );

        if (livros.length > 0) {
            return res.status(200).json(livrosComExemplares);
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
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID do exemplar não informado!'
            });
        }

        const id = req.params.id;

        // Testa se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID ${id} não é um número!`,
            });
        }

        // Verifica se exemplar existe
        const exemplar = await Exemplar.findByPk(id);

        if (!exemplar) {
            return res.status(404).json({
                mensagem: `Exemplar com ID ${id} não encontrado!`
            });
        }

        res.status(200).json(exemplar);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const inserir = async (req, res) => {

    const transaction = await Exemplar.sequelize.transaction();

    try {
        const quantidade = parseInt(req.body.quantidade) || 1;
        // Filtrando dados
        const requiredColumns = await util.requiredColumns(Exemplar.getTableName());
        const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

        const data = util.filterObjectKeys(req.body, permittedColumns);

        if (!util.keysMatch(data, requiredColumns)) {
            return res.status(400).json({
                mensagem: 'Dados obrigatórios não informados',
                obrigatorios: requiredColumns,
                informados: Object.keys(data)
            });
        }

        // Verificar se livro existe
        const livro = await Livro.findByPk(data.id_livro);

        if (!livro) {
            return res.status(404).json({
                mensagem: `Livro com ID ${data.id_livro} não encontrado!`
            });
        }

        // Verificar se editora existe
        const editora = await Editora.findByPk(data.id_editora);

        if (!editora) {
            return res.status(404).json({
                mensagem: `Editora com ID ${data.id_editora} não encontrada!`
            });
        }

        const exemplares = [];
        for (let i = 0; i < quantidade; i++) {
            const exemplar = await Exemplar.create(data, { transaction });
            exemplares.push(exemplar);
        }

        if (exemplares.length == quantidade) {
            await transaction.commit();
            return res.status(201).json(exemplares);
        }

        throw new Error("Exemplares não cadastrados");

    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {

    try {
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: 'ID do exemplar não informado!'
            });
        }

        const id = req.params.id;

        // Testa se ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID ${id} não é um número!`,
            });
        }

        // Verifica se exemplar existe
        const exemplar = await Exemplar.findByPk(id);

        if (!exemplar) {
            return res.status(404).json({
                mensagem: `Exemplar com ID ${id} não encontrado!`
            });
        }

        // Filtrando dados
        const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

        const data = util.filterObjectKeys(req.body, permittedColumns);

        if(data.hasOwnProperty('id_livro')){
            return res.status(409).json({
                mensagem: `Não é possível mudar o livro do exemplar após o mesmo ter sido criado!`
            });
        }

        const [exemplarLinhasAtualizadas] = await Exemplar.update(data, {
            where: { id }
        });

        if(exemplarLinhasAtualizadas > 0){
            return res.status(200).json({
                mensagem: 'Exemplar atualizado com sucesso!',
            });
        }

        throw new Error("Exemplar não atualizado");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { listar, selecionar, inserir, alterar, isSituacaoValida };