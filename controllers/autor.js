import autor from '../models/autor.js';

const listar = async (req, res) => {
    const dados = await autor.findAll();
    const statusCode = dados.length > 0 ? 200 : 204;
    res.status(statusCode).json(dados);
}

const selecionar = async (req, res) => {
    await autor.findByPk(req.params.id)
        .then(result => {
            const statusCode = result ? 200 : 204;
            res.status(statusCode).json(result);
        })
        .catch(err => res.status(400).json(err));
}

const inserir = async (req, res) => {
    await autor.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(400).json(err));
}

const alterar = async (req, res) => {
    await autor.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

const excluir = async (req, res) => {
    await autor.destroy({
        where: { id: req.params.id }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

export default { listar, selecionar, inserir, alterar, excluir };