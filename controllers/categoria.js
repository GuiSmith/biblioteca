import categoria from '../models/categoria.js';
import livro from '../models/livro.js';
import util from './util.js';

const listar = async (req, res) => {
    const dados = await categoria.findAll();
    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json(dados);
}

const listarLivros = async (req, res) => {
    // Verifica se foi passado um ID na requisiçao
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "Categoria não informada" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    const dados = await livro.findAll({
        where: { id_categoria: id }
    });


    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json({
        categoria: categoriaExistente.dataValues,
        livros: dados.map(livro => livro.dataValues)
    });
}

const selecionar = async (req, res) => {
    // Verifica se foi passado um ID na requisição
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Busca a categoria pelo ID
    await categoria.findByPk(id)
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
        .then(result => res.status(201).json({
            mensagem: "Categoria inserida com sucesso",
            categoria: result
        }))
        .catch(err => res.status(500).json({
            mensagem: "Erro ao inserir categoria",
            erro: err
        }));
}

const alterar = async (req, res) => {
    // Verifica se foi passado um ID na requisição
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(req.params.id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Filtrando dados passados
    const permittedColumns = await util.permittedColumns(categoria.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    
    if (Object.keys(data).length == 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado informado para atualização",
            permitidos: permittedColumns,
            informados: Object.keys(data)
        });
    }
    
    // Atualiza os dados
    await categoria.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: `Categoria atualizada com sucesso`,
        }))
        .catch(err => res.status(500).json({
            mensagem: `Erro ao atualizar categoria`,
            erro: err
        }));
}

const excluir = async (req, res) => {
    // Verifica se foi passado um ID na requisição
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const categoriaExistente = await categoria.findByPk(id);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Exclui o registro
    await categoria.destroy({
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: `Categoria excluída com sucesso`,
        }))
        .catch(err => res.status(400).json({
            mensagem: `Erro ao excluir categoria`,
            erro: err,
        }));
}

export default { listar, selecionar, inserir, alterar, excluir, listarLivros };