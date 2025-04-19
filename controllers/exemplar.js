import Exemplar from '../models/exemplar.js';
import Livro from '../models/livro.js';
import util from './util.js';

const listar = async (req, res) => {

    const livros = await Livro.findAll();

    if(livros.length == 0){
        return res.status(204).json({
            mensagem: 'Nenhum livro cadastrado!'
        });
    }

    const exemplares = await Exemplar.findAll({
        where: {
            id_livro: livros.map(livro => livro.id)
        }
    });

    console.log(exemplares);

    livros.exemplares = [...exemplares];

    console.log(livros);

    res.status(200).json(livros);
}

const selecionar = async (req, res) => {
    const id = req.params.id;
    // Testa se ID é número
    if(!util.isNumber(id)){
        return {
            status: 400,
            mensagem: `ID ${id} não é um número!`,
        };
    }
    await Exemplar.findByPk(id)
        .then(result => {
            res.status(result ? 200 : 204).json(result);
        })
        .catch(err => {
            res.stats(500).json(err);
        });
}

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Exemplar.getTableName());
    const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(!util.keysMatch(data, requiredColumns)){
        res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    console.log(data);

    await Exemplar.create(data)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
}

export default { listar, selecionar, inserir };