import '../models/relacionamentos.js';

// Modelos
import Livro from '../models/livro.js';
import Categoria from '../models/categoria.js';
import Exemplar from '../models/exemplar.js';

// Controladores
import livroAutor from './livroAutor.js';
import util from './util.js';

const listar = async (req, res) => {
    await Livro.findAll()
        .then(result => res.status(result ? 200 : 204).json(result))
        .catch(err => res.status(400).json({
            mensagem: "Erro ao listar livros",
            erro: err
        }));
}

const selecionar = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Buscando o livro
    await Livro.findByPk(id)
        .then(result => res.status(result ? 200 : 204).json(result))
        .catch(err => res.status(400).json({
            mensagem: "Erro ao buscar livro",
            erro: err
        }));
}

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Livro.getTableName());
    const permittedColumns = await util.permittedColumns(Livro.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (!util.keysMatch(data, requiredColumns)) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }
    console.log(data);
    
    // Verifica se a categoria existe
    const categoriaExistente = await Categoria.findByPk(data.id_categoria);
    if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }
    
    await Livro.create(data)
        .then(result => res.status(201).json({
            mensagem: "Livro inserido com sucesso",
            livro: result
        }))
        .catch(err => res.status(500).json({
            mensagem: "Erro ao inserir livro",
            erro: err
        }));
}

const alterar = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroExistente = await Livro.findByPk(id);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Filtrando dados
    const permittedColumns = await util.permittedColumns(Livro.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (Object.keys(data).length == 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado informado para atualização",
            permitidos: permittedColumns,
            informados: Object.keys(data)
        });
    }
    
    // Verifica se a categoria existe
    if(data.id_categoria) {
        const categoriaExistente = await Categoria.findByPk(data.id_categoria);
        if (!categoriaExistente) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }
    }
    console.log(data);
    // Atualiza o livro
    await Livro.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: "Livro atualizado com sucesso",
        }))
        .catch(err => res.status(400).json({
            mensagem: "Erro ao atualizar livro",
            erro: err
        }));
}

const excluir = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const livroExistente = await Livro.findByPk(id);
    if (!livroExistente) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }
    // Exclui o livro
    await Livro.destroy({
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: "Livro excluído com sucesso",
        }))
        .catch(err => res.status(400).json({
            mensagem: "Erro ao excluir livro",
            erro: err
        }));
}

const listarExemplares = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id_livro) {
        return res.status(400).json({ mensagem: "ID de livro não informado" });
    }
    const id_livro = req.params.id_livro;
    // Verifica se o id_livro é um número
    if (!util.isNumber(id_livro)) {
        return res.status(400).json({ mensagem: "ID de livro não é um número" });
    }
    // Verifica se o ID existe
    const livro = await Livro.findByPk(id_livro);
    if (!livro) {
        return res.status(404).json({ mensagem: `Livro não encontrado com ID ${id_livro}` });
    }
    
    // Verifica se o livro possui exemplares
    const exemplares = await Exemplar.findAll({
        where: { id_livro },
    });

    return res.status(exemplares.length > 0 ? 200 : 204).json({
        livro: livro.dataValues,
        exemplares: exemplares.map(exemplar => exemplar.dataValues)
    });
}


export default { listar, selecionar, listarExemplares, inserir, alterar, excluir };