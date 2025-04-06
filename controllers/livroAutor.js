import livroAutor from "../models/livro_autor.js";
import util from "./util.js";

const tabela = "livro_autor";
import livro from "../models/livro.js";
import autor from "../models/autor.js";

const listar = async (req, res) => {
    const dados = await livroAutor.findAll();
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
};

const livros = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const autorExistente = await livro.sequelize.models.autor.findByPk(req.params.id);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    const dados = await livroAutor.findAll({
        where: {
            id_autor: req.params.id,
        },
        include: [
            {
                model: livros,
                as: "livro",
                attributes: ["id", "titulo"],
            },
        ],
    });
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
};

const autores = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroExistente = await livro.sequelize.models.livro.findByPk(req.params.id);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    const dados = await livroAutor.findAll({
        where: {
            id_livro: req.params.id,
        },
        include: [
            {
                model: autor,
                as: "autor",
                attributes: ["id", "nome"],
            },
        ],
    });
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
};

const selecionar = async (req, res) => {
    await livroAutor.findByPk(req.params.id)
        .then(result => {
            const statusCode = result ? 200 : 204;
            res.status(statusCode).json(result);
        })
        .catch(err => res.status(400).json(err));
};

const inserir = async (req,res) => {
    const requiredColumns = await util.requiredColumns(tabela);
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (util.keysMatch(data, requiredColumns) === false) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }
    console.log(data);
    // Verifica se o livro existe
    const livroExistente = await livro.sequelize.models.livro.findByPk(data.id_livro);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Verifica se o autor existe
    const autorExistente = await livro.sequelize.models.autor.findByPk(data.id_autor);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    await livroAutor.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
};

const alterar = async (req, res) => {
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, [...permittedColumns, "id"]);
    if (Object.keys(data).length == 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado informado para atualização",
            permitidos: permittedColumns,
            informados: Object.keys(data),
        });
    }
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroAutorExistente = await livroAutor.findByPk(req.params.id);
    if (!livroAutorExistente) {
        return res.status(404).json({ mensagem: "LivroAutor não encontrado" });
    }
    // Verifica se o livro existe
    const livroExistente = await livro.sequelize.models.livro.findByPk(data.id_livro);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Verifica se o autor existe
    const autorExistente = await livro.sequelize.models.autor.findByPk(data.id_autor);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    // Atualiza o livroAutor
    await livroAutor.update(data, { where: { id: req.params.id } })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
};

const excluir = async (req, res) => {
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroAutorExistente = await livroAutor.findByPk(req.params.id);
    if (!livroAutorExistente) {
        return res.status(404).json({ mensagem: "LivroAutor não encontrado" });
    }
    await livroAutor.destroy({ where: { id: req.params.id } })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
};

export default { listar, selecionar, inserir, alterar, excluir, livros, autores };