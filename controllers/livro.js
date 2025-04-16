import '../models/relacionamentos.js';
import livro from '../models/livro.js';
import livroAutor from './livroAutor.js';
import util from './util.js';

const tabela = 'livro';

const listar = async (req, res) => {
    const dados = await livro.findAll({
        include: [
            { model: livro.sequelize.models.categoria, as: 'categoria' }
        ]
    });
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
}

const selecionar = async (req, res) => {
    await livro.findByPk(req.params.id)
        .then(result => {
            const statusCode = result ? 200 : 204;
            res.status(statusCode).json(result);
        })
        .catch(err => res.status(400).json(err));
}

const inserir = async (req, res) => {
    const requiredColumns = await util.requiredColumns(tabela);
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (!util.keysMatch(data, requiredColumns) === false) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }
    console.log(data);
    // Verifica se a categoria existe
    const categoriaExistente = await livro.sequelize.models.categoria.findByPk(data.id_categoria);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    await livro.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
}

const alterar = async (req, res) => {
    const permittedColumns = await util.permittedColumns(tabela);
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
    const livroExistente = await livro.findByPk(req.params.id);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Verifica se a categoria existe
    const categoriaExistente = await livro.sequelize.models.categoria.findByPk(data.id_categoria);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    // Atualiza o livro
    await livro.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

const excluir = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroExistente = await livro.findByPk(req.params.id);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Exclui o livro
    await livro.destroy({
        where: { id: req.params.id }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

const inserirLivroAutor = async (req, res) => {
    const id_livro = req.params.id;
    const id_autor = req.body.id_autor;
    const response = await livroAutor.inserir({ id_livro, id_autor });
    const status = response.status;
    delete response.status;
    res.status(status).json(response);
};

const alterarLivroAutor = async (req, res) => {
    const id = req.body.id;
    const id_livro = req.params.id;
    const id_autor = req.body.id_autor;
    const response = await livroAutor.alterar({id, id_livro, id_autor});

    const status = response.status;
    delete response.status;

    res.status(status).json(response);
};

const excluirLivroAutor = async (req, res) => {
    const id = req.params.id;
    const response = await livroAutor.excluir({id});

    const status = response.status;
    delete response.status;

    res.status(status).json(response);
}

export default { listar, selecionar, inserir, alterar, excluir, inserirLivroAutor, alterarLivroAutor, excluirLivroAutor };