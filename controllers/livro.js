import '../models/relacionamentos.js';

// Modelos
import Livro from '../models/livro.js';
import Categoria from '../models/categoria.js';
import Exemplar from '../models/exemplar.js';
import LivroAutor from '../models/livro_autor.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    try {
        const livros = await Livro.findAll();
        if(livros.length > 0){
            return res.status(200).json(livros);
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const selecionar = async (req, res) => {
    try {
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
        const livroExistente = await Livro.findByPk(id);

        if (!livroExistente) {
            return res.status(404).json({
                mensagem: `Livro não encontrado`
            });
        }

        return res.status(200).json(livroExistente.dataValues);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const inserir = async (req, res) => {
    try {
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

        // Verifica se a categoria existe
        const categoriaExistente = await Categoria.findByPk(data.id_categoria);
        if (!categoriaExistente) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }

        const novoLivro = await Livro.create(data);

        return res.status(201).json(novoLivro);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {
    try {
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
        if (data.hasOwnProperty('id_categoria')) {
            const categoriaExistente = await Categoria.findByPk(data.id_categoria);
            if (!categoriaExistente) {
                return res.status(404).json({ mensagem: "Categoria não encontrada" });
            }
        }

        // Atualiza o livro
        const [livroLinhasAtualizadas] = await Livro.update(data, {
            where: { id }
        });

        if (livroLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: "Livro atualizado com sucesso",
            });
        }

        throw new Error("Livro não atualizado");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const excluir = async (req, res) => {
    try {
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

        // Verificar se existem exemplares com este livro
        const exemplaresExistentes = await Exemplar.findAll({
            where: { id_livro: id }
        });

        if (exemplaresExistentes.length > 0) {
            return res.status(409).json({
                mensagem: `Não é possível deletar livros, há exemplares vinculados a ele`
            });
        }

        // Verificar se existem autores com este livro
        const autoresExistentes = await LivroAutor.findAll({
            where: { id_livro: id}
        });

        if(autoresExistentes.length > 0){
            return res.status(409).json({
                mensagem: `Não é possível deletar livros, há autores vinculados a ele`
            });
        }

        // Exclui o livro
        const livroLinhasExcluidas = await Livro.destroy({
            where: { id }
        });

        if (livroLinhasExcluidas > 0) {
            return res.status(200).json({
                mensagem: "Livro excluído com sucesso",
            });
        }

        throw new Error("Livro não excluído");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const listarExemplares = async (req, res) => {
    try {
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
        const livroExistente = await Livro.findByPk(id_livro);
        if (!livroExistente) {
            return res.status(404).json({ mensagem: `Livro não encontrado com ID ${id_livro}` });
        }

        // Verifica se o livro possui exemplares
        const exemplares = await Exemplar.findAll({
            where: { id_livro },
        });

	return res.status(200).json({
		livro: livroExistente.dataValues,
		exemplares: exemplares.length > 0 ? exemplares.map(exemplar => exemplar.dataValues) : []
	});
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { listar, selecionar, listarExemplares, inserir, alterar, excluir };
