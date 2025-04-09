import '../models/relacionamentos.js';
import livroAutor from "../models/livro_autor.js";
import Livro from "../models/livro.js";
import Autor from "../models/autor.js";
import util from './util.js';
import LivroAutor from '../models/livro_autor.js';

const tabela = 'livro_autor';

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

const inserir = async ({id_autor, id_livro}) => {
    // Valida se ID de livro passado é número
    if(!util.isNumber(id_livro)){
        return {
            status: 400,
            mensagem: `ID de livro ${id_livro} não é do tipo número!`
        }
    }

    // Valida se livro existe
    const livroExistente = await Livro.findByPk(id_livro);
    if(!livroExistente){
        return {
            status: 400,
            mensagem: `Livro ID ${id_livro} não encontrado!`
        }
    }

    // Valida se ID de autor passado é número
    if(!util.isNumber(id_autor)){
        return {
            status: 400,
            mensagem: `ID de autor ${id_autor} não é do tipo número!`
        };
    }

    // Valida se autor existe
    const autorExistente = Autor.findByPk(id_autor);
    if(!autorExistente){
        return {
            status: 400,
            mensagem: `Autor ID ${id_autor} não encontrado!`
        };
    }

    // Valida se já não existe vínculo
    const livroAutorExistente = await LivroAutor.findOne({
        where: {
            id_livro, id_autor
        }
    });
    if(livroAutorExistente){
        return {
            status: 400,
            mensagem: `Já possui vínculo entre este autor e livro!`
        };
    }

    return await livroAutor.create({id_livro, id_autor})
        .then(result => ({
            status: 201,
            ...result.dataValues
        }))
        .catch(err => ({
            status: 500,
            ...err
        }));
};

const alterar = async ({id, id_autor, id_livro}) => {
    // Valida se ID passado é do tipo número
    if(!util.isNumber(id)){
        return {
            status: 400,
            mensagem: `ID ${id} não é do tipo número: ${typeof(id)}`
        };
    }
    
    // Valida se existe ID passado
    const livroAutorExistente = await livroAutor.findByPk(id);
    if(!livroAutorExistente){
        return {
            status: 400,
            mensagem: `Vínculo ID ${id} não existe!`
        };
    }

    // Valida se ID de livro passado é número
    if(!util.isNumber(id_livro)){
        return {
            status: 400,
            mensagem: `ID de livro ${id_livro} não é do tipo número!`
        }
    }

    // Valida se livro existe
    const livroExistente = await Livro.findByPk(id_livro);
    if(!livroExistente){
        return {
            status: 400,
            mensagem: `Livro ID ${id_livro} não encontrado!`
        }
    }

    // Valida se ID de autor passado é número
    if(!util.isNumber(id_autor)){
        return {
            status: 400,
            mensagem: `ID de autor ${id_autor} não é do tipo número!`
        };
    }

    // Valida se autor existe
    const autorExistente = Autor.findByPk(id_autor);
    if(!autorExistente){
        return {
            status: 400,
            mensagem: `Autor ID ${id_autor} não encontrado!`
        };
    }

    // Valida se já não existe vínculo
    const outroLivroAutorExistente = await LivroAutor.findOne({
        where: {
            id_livro, id_autor
        }
    });

    if(outroLivroAutorExistente && outroLivroAutorExistente.dataValues.id !== livroAutorExistente.dataValues.id){
        return {
            status: 400,
            mensagem: `Já possui vínculo entre este autor e livro no ID ${outroLivroAutorExistente.dataValues.id}`
        };
    }

    // Atualiza o livroAutor
    return await livroAutor.update({ id_autor, id_livro }, { where: { id } })
        .then(result => ({
            status: 200,
            mensagem: ` ${result[0]} linhas alteradas`
        }))
        .catch(err => ({
            status: 500,
            ...err
        }));
};

const excluir = async (id) => {
    await livroAutor.destroy({ where: { id: id } })
        .then(result => result)
        .catch(err => err);
};

export default { selecionar, inserir, alterar, excluir, listarAutores, listarLivros, tabela };