import autor from '../models/autor.js';
import util from './util.js';

const tabela = 'autor';

const listar = async (req, res) => {
    const dados = await autor.findAll();
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
}

const selecionar = async (req, res) => {

    // Verifica se o ID é um número
    if (!util.isNumber(req.params.id)) {
        return res.status(400).json({ mensagem: "ID inválido" });
    }
    await autor.findByPk(req.params.id)
        .then(result => {
            const statusCode = result ? 200 : 204;
            res.status(statusCode).json(result);
        })
        .catch(err => res.status(500).json(err));
}

const inserir = async (req, res) => {
    const requiredColumns = await util.requiredColumns(tabela);
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, permittedColumns);
    if(util.keysMatch(data, requiredColumns) === false) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados",
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }
    console.log(data);
    await autor.create(data)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
}

const alterar = async (req, res) => {
    const permittedColumns = await util.permittedColumns(tabela);
    const data = util.filterObjectKeys(req.body, [...permittedColumns, 'id']);
    if(Object.keys(data).length == 0){
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
    const autorExistente = await autor.findByPk(req.params.id);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    // Atualiza os dados
    await autor.update(req.body, {
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
    const autorExistente = await autor.findByPk(req.params.id);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado" });
    }
    // Exclui o autor
    await autor.destroy({
        where: { id: req.params.id }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export default { listar, selecionar, inserir, alterar, excluir };