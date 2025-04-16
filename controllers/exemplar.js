import Exemplar from '../models/exemplar.js';
import util from './util.js';

const listar = async (req, res) => {
    const dados = await Exemplar.findAll();
    const status = dados.length > 0 ? 200 : 204;
    res.status(status).json(dados);
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
    const requiredColumns = await util.requiredColumns(Exemplar.getTableName());
    const permittedColumns = await util.permittedColumns(Exemplar.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(util.keysMatch(data, requiredColumns) == false){
        res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    console.log(data);

    await Exemplar.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
}

export default { listar, selecionar, inserir };