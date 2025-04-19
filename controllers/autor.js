import autor from '../models/autor.js';
import util from './util.js';

const tabela = 'autor';

const listar = async (req, res) => {
    await autor.findAll()
        .then(result => res.status(result.length > 0 ? 200 : 204).json(result))
        .catch(err => res.status(500).json({
            mensagem: `Erro ao listar autores`,
            erro: err
        }));
}

const selecionar = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Seleciona o autor
    await autor.findByPk(req.params.id)
        .then(result => res.status(result ? 200 : 204).json(result))
        .catch(err => res.status(500).json({
            mensagem: `Erro ao selecionar autor`,
            erro: err
        }));
}

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(tabela);
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, permittedColumns);
    
    // Verificando se os dados obrigatórios foram informados
    if(util.keysMatch(data, requiredColumns) === false) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Criando o autor
    console.log(data);
    await autor.create(data)
        .then(result => res.status(201).json({
            mensagem: `Autor ${result.nome} inserido com sucesso`,
            autor: result
        }))
        .catch(err => res.status(500).json({
            mensagem: `Erro ao inserir autor`,
            erro: err
        }));
}

const alterar = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({ mensagem: "ID não informado" });
    }
    const id = req.params.id;

    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    // Verifica se o ID existe
    const autorExistente = await autor.findByPk(req.params.id);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }

    // Filtrando dados
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if(Object.keys(data).length == 0){
        return res.status(400).json({
            mensagem: "Nenhum dado informado para atualização",
            permitidos: permittedColumns,
            informados: Object.keys(data)
        });
    }

    // Atualiza os dados
    await autor.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: `Autor atualizado com sucesso`,
        }))
        .catch(err => res.status(400).json({
            mensagem: `Erro ao atualizar autor`,
            erro: err
        }));
}

const excluir = async (req, res) => {
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
    const autorExistente = await autor.findByPk(id);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    // Exclui o autor
    await autor.destroy({
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: `Autor excluído com sucesso`
        }))
        .catch(err => res.status(500).json({
            mensagem: `Erro ao excluir autor`,
            erro: err
        }));
}

export default { listar, selecionar, inserir, alterar, excluir };