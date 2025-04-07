import '../models/relacionamentos.js';
import livroAutor from "../models/livro_autor.js";
import Livro from "../models/livro.js";
import Autor from "../models/autor.js";

const listarLivros = async (id_autor) => {
    const livros = await livroAutor.findAll({
        where: { id_autor: id_autor },
        include: [{
            model: Livro,
            as: "livro",
        }],
    });

    const autor = await Autor.findByPk(id_autor);

    return {
        autor: autor.dataValues,
        livros: livros.map((livro) => ({
            ...livro.livro.dataValues,
            livro_autor: {
                id: livro.id,
                id_autor: livro.id_autor,
                id_livro: livro.id_livro
            }
        })),
    }
};

const listarAutores = async (id_livro) => {
    const autores = await livroAutor.findAll({
        where: { id_livro: id_livro },
        include: [{
            model: Autor,
            as: 'autor',
        }],
    });

    const livro = await Livro.findByPk(id_livro);

    return {
        livro: livro.dataValues,
        autores: autores.map((autor) => ({
            ...autor.autor.dataValues,
            livro_autor: {
                id: autor.id,
                id_autor: autor.id_autor,
                id_livro: autor.id_livro,
            }
        }))
    };
}

const selecionar = async (id) => {
    const registro = await livroAutor.findByPk(id);
    return registro.dataValues;
}

const inserir = async (id_autor, id_livro) => {
    const registro = await livroAutor.create({ id_autor, id_livro });
    return registro.dataValues;
};

const alterar = async (id, id_autor, id_livro) => {
    // Atualiza o livroAutor
    await livroAutor.update({ id, id_autor, id_livro }, { where: { id: id } })
        .then(result => result)
        .catch(err => err);
};

const excluir = async (id) => {
    await livroAutor.destroy({ where: { id: id } })
        .then(result => result)
        .catch(err => err);
};

export default { selecionar, inserir, alterar, excluir, listarAutores, listarLivros };