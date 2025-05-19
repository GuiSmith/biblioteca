// Bibliotecas
import { Op } from 'sequelize';

// Serviços
import models from './models.js';

// Controladores
import util from '../controllers/util.js';

// Função para separar operador de valor para cada chave de query
const parseFiltro = (filtros) => {
    const opMap = {
        eq: Op.eq,
        ne: Op.ne,
        gt: Op.gt,
        gte: Op.gte,
        lt: Op.lt,
        lte: Op.lte,
        like: Op.iLike,
        in: Op.in,
    };

    const result = {};
    for (const [chave, valor] of Object.entries(filtros)) {
        const [operador, val] = valor.split(":");
        if (!opMap[operador]) continue;

        const op = opMap[operador];

        if (operador === 'in') {
            result[chave] = { [op]: val.split(',') };
            continue;
        }

        if (operador === 'like') {
            result[chave] = { [op]: `%${val}%` };
            continue;
        }

        result[chave] = { [op]: val };
    }
    return result;
};

const search = async (req, res) => {
    try {
        // Verificando se o nome da tabela foi passado
        if (!req.params.tabela) {
            return res.status(400).json({
                mensagem: `Tabela não informada`
            });
        }
        const { tabela } = req.params;
        const modelo = models[tabela];

        if (!modelo) {
            return res.status(404).json({
                mensagem: `Tabela ${tabela} não encontrada!`
            });
        }

        // Filtros
        const query = req.query;
        const colunas = Object.keys(modelo.getAttributes());
        // Checando se colunas existem
        for (const chave in query) {
            if (!colunas.includes(chave)) {
                return res.status(404).json({
                    mensagem: `Coluna ${chave} não existe na tabela ${tabela}`,
                    colunas
                });
            }
        }
        const filtros = parseFiltro(query);

        const dados = await modelo.findAll({ where: filtros });

        if(dados.length > 0){
            return res.status(200).json(dados);
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error: error.message
        });
    }
};

export default { search };