//Modelos
import Categoria from '../models/categoria.js';
import Livro from '../models/livro.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        return res.status(categorias.length > 0 ? 200 : 204).json(categorias);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const listarLivros = async (req, res) => {
    try {
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
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }
        const dados = await Livro.findAll({
            where: { id_categoria: id }
        });

        return res.status(dados.length > 0 ? 200 : 204).json({
            categoria: categoriaExistente.dataValues,
            livros: dados.map(livro => livro.dataValues)
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const selecionar = async (req, res) => {
    try {
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
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }

        return res.status(200).json(categoriaExistente.dataValues);
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
        const requiredColumns = await util.requiredColumns(Categoria.getTableName());
        const permittedColumns = await util.permittedColumns(Categoria.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns);
        console.log(data,permittedColumns,requiredColumns);
        if (util.keysMatch(data, requiredColumns) === false) {
            return res.status(400).json({
                mensagem: "Dados obrigatórios não informados",
                obrigatorios: requiredColumns,
                informados: Object.keys(data)
            });
        }

        const novaCategoria = await Categoria.create(data);

        return res.status(201).json(novaCategoria);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {
    try {
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
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada",
            });
        }

        // Filtrando dados passados
        const permittedColumns = await util.permittedColumns(Categoria.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns);

        if (Object.keys(data).length == 0) {
            return res.status(400).json({
                mensagem: "Nenhum dado informado para atualização",
                permitidos: permittedColumns,
                informados: Object.keys(data)
            });
        }

        // Atualiza os dados
        const [categoriaLinhasAlteradas] = await Categoria.update(data, {
            where: { id }
        });

        if (categoriaLinhasAlteradas > 0) {
            return res.status(200).json({
                mensagem: `Categoria alterada com sucesso`
            });
        }

        throw new Error("Categoria não atualizada");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const excluir = async (req, res) => {
    try {
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
        const categoriaExistente = await Categoria.findByPk(id);
        if (!categoriaExistente) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }
        
        // Verifica se há algum livro com esta categoria
        const livrosExistentes = await Livro.findAll({
            where: { id_categoria: id }
        });

        if(livrosExistentes.length > 0){
            return res.status(409).json({
                mensagem: `Não é possível deletar categoria pois ela tem livros cadastrados`
            });
        }
        
        // Exclui o registro
        const categoriaLinhasExcluidas = await Categoria.destroy({
            where: { id }
        });

        if(categoriaLinhasExcluidas > 0){
            return res.status(200).json({
                mensagem: `Categoria excluída com sucesso`,
            });
        }

        throw new Error("Categoria não excluída");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { listar, selecionar, inserir, alterar, excluir, listarLivros };