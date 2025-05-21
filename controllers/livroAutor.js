import '../models/relacionamentos.js';

// Modelos
import livroAutor from "../models/livro_autor.js";
import Livro from "../models/livro.js";
import Autor from "../models/autor.js";

// Controladores
import util from './util.js';

const listarLivros = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id_autor) {
        res.status(400).json({ mensagem: "ID não informado" });
    }
    const id_autor = req.params.id_autor;

    const autor = await Autor.findByPk(id_autor);

    const livros = await livroAutor.findAll({
        where: { id_autor },
        include: [{
            model: Livro,
            as: 'livro',
        }],
    });

    res.status(livros ? 200 : 204).json({
        autor: autor.dataValues,
        livros: livros.map((livro) => ({
            ...livro.livro.dataValues,
        })),
    });
};

const listarAutores = async (req, res) => {
    // Verifica se foi informado um ID
    if(!req.params.id_livro){
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id_livro = req.params.id_livro;
    
    // Verifica se ID é um número
    if(!util.isNumber(id_livro)){
        return res.status(400).json({ mensagem: 'ID não é número!' });
    }

    const livro = await Livro.findByPk(id_livro);

    const autores = await livroAutor.findAll({
        where: { id_livro },
        include: [{
            model: Autor,
            as: 'autor',
        }],
    });

    res.status(autores ? 200 : 204).json({
        livro: livro.dataValues,
        autores: autores.map((autor) => ({
            ...autor.autor.dataValues,
        }))
    });
}

const inserir = async (req, res) => {

    // Filtrando dados
    const requiredColumns = await util.requiredColumns(livroAutor.getTableName());
    const permittedColumns = await util.permittedColumns(livroAutor.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if (!util.keysMatch(data, requiredColumns)) {
        res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Valida se ID de livro passado é número
    if (!util.isNumber(data.id_livro)) {
        return res.status(400).json({
            mensagem: `ID de livro ${data.id_livro} não é do tipo número!`
        });
    }

    // Valida se livro existe
    const livroExistente = await Livro.findByPk(data.id_livro);
    if (!livroExistente) {
        return res.status(400).json({
            mensagem: `Livro ID ${data.id_livro} não encontrado!`
        });
    }

    // Valida se ID de autor passado é número
    if (!util.isNumber(data.id_autor)) {
        return res.status(400).json({
            mensagem: `ID de autor ${data.id_autor} não é do tipo número!`
        });
    }

    // Valida se autor existe
    const autorExistente = Autor.findByPk(data.id_autor);
    if (!autorExistente) {
        return res.status(400).json({
            mensagem: `Autor ID ${data.id_autor} não encontrado!`
        });
    }

    // Valida se já não existe vínculo
    const livroAutorExistente = await livroAutor.findOne({
        where: {
            id_livro: data.id_livro,
            id_autor: data.id_livro
        }
    });
    if (livroAutorExistente) {
        return res.status(409).json({
            mensagem: `Já possui vínculo entre este autor e livro!`
        });
    }

    return await livroAutor.create(data)
        .then(result => 
            res.status(201).json({
                mensagem: `Vínculo inserido com sucesso`,
                livroAutor: result
            })
        )
        .catch(err => res.status(500).json({
            mensagem: `Houve um erro ao inserir vínculo `,
            erro: err
        }));
};

const alterar = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;

    // Valida se ID passado é do tipo número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: `ID ${id} não é do tipo número: ${typeof (id)}` });
    }

    // Valida se existe ID passado
    const livroAutorExistente = await livroAutor.findByPk(id);
    if (!livroAutorExistente) {
        return res.status(400).json({ mensagem: `Vínculo com ID ${id} não existe` });
    }

    // Filtrando dados
    const requiredColumns = await util.requiredColumns(livroAutor.getTableName());
    const data = util.filterObjectKeys(req.body, requiredColumns);

    // Valida se ID de livro passado é número
    if (!util.isNumber(data.id_livro)) {
        return res.status(400).json({ mensagem: `ID de livro ${data.id_livro} não é do tipo número!` });
    }

    // Valida se livro existe
    const livroExistente = await Livro.findByPk(data.id_livro);
    if (!livroExistente) {
        return res.status(400).json({ mensagem: `Livro ID ${data.id_livro} não encontrado!` });
    }

    // Valida se ID de autor passado é número
    if (!util.isNumber(data.id_autor)) {
        return res.status(400).json({ mensagem: `ID de autor ${data.id_autor} não é do tipo número!` });
    }

    // Valida se autor existe
    const autorExistente = await Autor.findByPk(data.id_autor);
    if (!autorExistente) {
        return res.status(400).json({ mensagem: `Autor ID ${data.id_autor} não encontrado!` });
    }

    // Valida se já não existe vínculo
    const outroLivroAutorExistente = await livroAutor.findOne({
        where: {
            id_livro: data.id_livro,
            id_autor: data.id_autor
        }
    });

    if (outroLivroAutorExistente && outroLivroAutorExistente.dataValues.id !== livroAutorExistente.dataValues.id) {
        res.status(409).json({
            mensagem: `Já existe vínculo entre este autor e livro!`
        });
    }

    console.log(data);

    // Atualiza o livroAutor
    return await livroAutor.update(data, { where: { id } })
        .then(result => res.status(200).json({ mensagem: `Vínculo atualizado com sucesso` }))
        .catch(err => res.status(500).json({
            mensagem: `Houve um erro ao atualizar vínculo`,
            erro: err
        }));
};

const excluir = async (req, res) => {
    // Verifica se foi informado um ID
    if (!req.params.id) {
        return {
            status: 400,
            mensagem: "ID não informado",
        };
    }
    const id = req.params.id;
    // Valida se id passado é número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: `ID ${id} não é do tipo número: ${typeof (id)}` });
    }

    // Valida se existe um registro com o id passado
    const livroAutorExistente = await livroAutor.findByPk(id);
    if (!livroAutorExistente) {
        return res.status(400).json({ mensagem: `Vínculo com ID ${id} não existe` });
    }

    return await livroAutor.destroy({ where: { id: id } })
        .then(result => res.status(200).json({
            mensagem: `Vínculo excluído com sucesso`,
        }))
        .catch(err => res.status(500).json({
            mensagem: `Houve um erro ao excluir vínculo`,
            erro: err
        }));
};

// export default { selecionar, inserir, alterar, excluir, listarAutores, listarLivros };

export default { inserir, alterar, excluir, listarLivros, listarAutores };