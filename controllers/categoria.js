import categoria from '../models/categoria.js';
import livro from '../models/livro.js';
import util from './util.js';

const listar = async (req, res) => {
    const dados = await categoria.findAll();
    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json(dados);
}

const listarLivros = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(req.params.id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    const id = req.params.id;
    const dados = await livro.findAll({
        where: { id_categoria: id }
    });
    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json(dados);
}

const selecionar = async (req, res) => {
    await categoria.findByPk(req.params.id)
        .then(result => {
            const status = result ? 200 : 204;
            res.status(status).json(result);
        })
        .catch(err => res.status(500).json(err));
}

const inserir = async (req, res) => {
    const requiredColumns = await util.requiredColumns(categoria.getTableName());
    const permittedColumns = await util.permittedColumns(categoria.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (util.keysMatch(data, requiredColumns) === false) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }
    console.log(data);
    await categoria.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(400).json(err));
}

const alterar = async (req, res) => {
    const permittedColumns = await util.permittedColumns(categoria.getTableName());
    const data = util.filterObjectKeys(req.body, [...permittedColumns, 'id']);
    if (Object.keys(data).length == 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado informado para atualização",
            permitidos: permittedColumns,
            informados: Object.keys(data)
        });
    }
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(req.params.id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Atualiza os dados
    await categoria.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

const excluir = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(req.params.id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Exclui o registro
    await categoria.destroy({
        where: { id: req.params.id }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

export default { listar, selecionar, inserir, alterar, excluir, listarLivros };