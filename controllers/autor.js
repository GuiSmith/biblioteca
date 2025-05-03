// Modelos
import Autor from '../models/autor.js';
import LivroAutor from '../models/livro_autor.js';
// Controladores
import util from './util.js';

const listar = async (req, res) => {
    try {
        const autores = await Autor.findAll();
        return res.status(autores.length > 0 ? 200 : 204).json(autores);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const selecionar = async (req, res) => {
    try {
        // Verifica se o ID foi informado
        if (!req.params.id) {
            return res.status(400).json({ mensagem: "ID não informado" });
        }
        const id = req.params.id;
        // Verifica se o ID é um número
        if (!util.isNumber(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        // Seleciona o autor
        const autorExistente = await Autor.findByPk(id);
        if(!autorExistente){
            return res.status(404).json({
                mensagem: `Autor não encontrado`
            });
        }

        return res.status(200).json(autorExistente);
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
        const requiredColumns = await util.requiredColumns(Autor.getTableName());
        const permittedColumns = await util.permittedColumns(Autor.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns);

        // Verificando se os dados obrigatórios foram informados
        if (util.keysMatch(data, requiredColumns) === false) {
            return res.status(400).json({
                mensagem: "Dados obrigatórios não informados",
                obrigatorios: requiredColumns,
                informados: Object.keys(data)
            });
        }

        //Verificando data de nascimento
        if (data.hasOwnProperty('data_nascimento') && !util.validarData(data.data_nascimento)) {
            return res.status(400).json({
                mensagem: `Data inválida ${data.data_nascimento}`
            });
        }

        // Criando o autor

        const novoAutor = await Autor.create(data);

        return res.status(201).json(novoAutor);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {
    try {
        // Verifica se o ID foi informado
        if (!req.params.id) {
            return res.status(400).json({ mensagem: "ID não informado" });
        }
        const id = req.params.id;

        // Verifica se o ID é um número
        if (!util.isNumber(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        // Verifica se o ID existe
        const autorExistente = await Autor.findByPk(id);
        if (!autorExistente) {
            return res.status(404).json({ mensagem: "Autor não encontrado" });
        }

        // Filtrando dados
        const permittedColumns = await util.permittedColumns(Autor.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns);
        if (Object.keys(data).length == 0) {
            return res.status(400).json({
                mensagem: "Nenhum dado informado para atualização",
                permitidos: permittedColumns,
                informados: Object.keys(data)
            });
        }

        // Atualiza os dados
        const [autorLinhasAlteradas] = await Autor.update(data, {
            where: { id }
        });

        if (autorLinhasAlteradas > 0) {
            return res.status(200).json({
                mensagem: `Autor atualizado com sucesso`,
            });
        }

        throw new Error("Autor não atualizado");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const excluir = async (req, res) => {
    try {
        // Verifica se o ID foi informado
        if (!req.params.id) {
            return res.status(400).json({ mensagem: "ID não informado" });
        }
        const id = req.params.id;
        // Verifica se o ID é um número
        if (!util.isNumber(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        // Verifica se o ID existe
        const autorExistente = await Autor.findByPk(id);
        if (!autorExistente) {
            return res.status(404).json({ mensagem: "Autor não encontrado" });
        }

        // Verifica se há livros cadastrados com este autor
        const livrosExistentes = await LivroAutor.findAll({
            where: { id_autor: id }
        });

        if(livrosExistentes.length > 0){
            return res.status(409).json({
                mensagem: `Não é possível excluir autor, pois há livros vinculados`
            });
        }

        // Exclui o autor
        const autorLinhasExcluidas = await Autor.destroy({
            where: { id }
        });

        if(autorLinhasExcluidas > 0){
            return res.status(200).json({
                mensagem: `Autor excluído com sucesso`
            });
        }
        
        throw new Error("Autor não excluído");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { listar, selecionar, inserir, alterar, excluir };