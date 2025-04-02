import categoria from '../models/categoria.js';

const listar = async (req, res) => {
    const dados = await categoria.findAll();
    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json(dados);
}

const selecionar = async (req, res) => {
    await categoria.findByPk(req.params.id)
        .then(result => {
            const status = result ? 200 : 204;
            res.status(status).json(result);
        })
        .catch(err => res.status(400).json(err));
}

const inserir = async (req, res) => {
    await categoria.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(400).json(err));
}

const alterar = async (req, res) => {
    await categoria.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

const excluir = async (req, res) => {
    await categoria.destroy({
        where: { id: req.params.id }
    })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err));
}

export default { listar, selecionar, inserir, alterar, excluir };