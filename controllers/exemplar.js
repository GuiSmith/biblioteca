// Modelos
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
    const situacoesValidas = await Exemplar.getAttributes().situacao.values;
    return situacoesValidas.includes(situacao);
}

// Funções externas

const selecionar = async (req, res) => {

    if(!req.params.id){
        return res.status(400).json({
            mensagem: 'ID do exemplar não informado!'
        });
    }

    const id = req.params.id;

    // Testa se ID é número
    if(!util.isNumber(id)){
        return res.status(400).json({
            mensagem: `ID ${id} não é um número!`,
        });
    }

    // Verifica se exemplar existe
    const exemplar = await Exemplar.findByPk(id);

    if(!exemplar){
        return res.status(404).json({
            mensagem: `Exemplar com ID ${id} não encontrado!`
        });
    }

    res.status(200).json(exemplar);
}

const inserir = async (req, res) => {

    const quantidade = parseInt(req.body.quantidade) || 1;
    delete req.body.quantidade;
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Exemplar.getTableName());
    const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(!util.keysMatch(data, requiredColumns)){
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Verificar se livro existe
    const livro = await Livro.findByPk(data.id_livro);
    
    if(!livro){
        return res.status(404).json({
            mensagem: `Livro com ID ${data.id_livro} não encontrado!`
        });
    }

    // Verificar se editora existe
    const editora = await Editora.findByPk(data.id_editora);

    if(!editora){
        return res.status(404).json({
            mensagem: `Editora com ID ${data.id_editora} não encontrada!`
        });
    }

    const transaction = await Exemplar.sequelize.transaction();

    console.log('dados', data);
    console.log('quantidade', quantidade);

    try {
        const exemplares = [];
        for (let i = 0; i < quantidade; i++){
            const exemplar = await Exemplar.create(data, { transaction});
            exemplares.push(exemplar);
        }

        await transaction.commit();
        return res.status(201).json({
            mensagem: 'Exemplares cadastrados com sucesso!',
            exemplar: exemplares,
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar exemplares',
            erro: error,
        });
    }
}

const alterar = async (req, res) => {

    if(!req.params.id){
        return res.status(400).json({
            mensagem: 'ID do exemplar não informado!'
        });
    }

    const id = req.params.id;

    // Testa se ID é número
    if(!util.isNumber(id)){
        return res.status(400).json({
            mensagem: `ID ${id} não é um número!`,
        });
    }

    // Verifica se exemplar existe
    const exemplar = await Exemplar.findByPk(id);

    if(!exemplar){
        return res.status(404).json({
            mensagem: `Exemplar com ID ${id} não encontrado!`
        });
    }

    // Filtrando dados
    const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

    delete permittedColumns.id_livro;

    const data = util.filterObjectKeys(req.body, permittedColumns);

    try {
        await Exemplar.update(data, {
            where: { id }
        });

        return res.status(200).json({
            mensagem: 'Exemplar atualizado com sucesso!',
            exemplar: data,
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar exemplar',
            erro: error,
        });
    }
}

const excluir = async (req, res) => {
    if(!req.params.id){
        return res.status(400).json({
            mensagem: 'ID do exemplar não informado!'
        });
    }

    const id = req.params.id;

    // Testa se ID é número
    if(!util.isNumber(id)){
        return res.status(400).json({
            mensagem: `ID ${id} não é um número!`,
        });
    }

    // Verifica se exemplar existe
    const exemplar = await Exemplar.findByPk(id);

    if(!exemplar){
        return res.status(404).json({
            mensagem: `Exemplar com ID ${id} não encontrado!`
        });
    }

    try {
        await Exemplar.destroy({
            where: { id }
        });

        return res.status(200).json({
            mensagem: 'Exemplar excluído com sucesso!',
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao excluir exemplar',
            erro: error,
        });
    }
}

export default { selecionar, inserir, alterar, excluir, isSituacaoValida };