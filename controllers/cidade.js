// Bibliotecas

// Modelos
import Cidade from '../models/cidade.js';

// Controladores
import util from './util.js';

// Funções internas

const cidadeExistente = async (cod_ibge, id) => {

}

// Funções externas

const listar = async (req, res) => {
    try {
        const cidades = await Cidade.findAll();

        if (cidades.length > 0) {
            return res.status(200).json(cidades);
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const selecionar = async (req, res) => {
    try {
        // Verificar se o ID passado existe
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: `ID não informado`
            });
        }
        const id = req.param.id;

        // Verifica se o ID é número
        if (!util.isNumber(id)) {
            return res.status(400).json({
                mensagem: `ID não é um número`
            });
        }

        // Verifica se existe
        const cidadeExistente = Cidade.findByPk(id);

        if (!cidadeExistente) {
            return res.status(404).json({
                mensagem: `Cidade não encontrada`
            });
        }

        return res.status(200).json(cidadeExistente.dataValues);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const inserir = async (req, res) => {
    try {
        // Filtrando dados
        const requiredColumns = await util.requiredColumns(Categoria.getTableName());
        const permittedColumns = await util.permittedColumns(Categoria.getTableName());
        const uniqueColumns = await util.uniqueColumns(Categoria.getTableName());

        const data = util.filterObjectKeys(req.body, permittedColumns);
        if (util.keysMatch(data, requiredColumns) === false) {
            return res.status(400).json({
                mensagem: "Dados obrigatórios não informados",
                obrigatorios: requiredColumns,
                informados: Object.keys(data)
            });
        }

        for (const column of uniqueColumns) {
            if (data.hasOwnProperty(column)) {
                const exists = await Cidade.findOne({
                    where: {
                        [column]: data[column],
                    },
                });

                if (exists) {
                    return res.status(409).json({
                        mensagem: `Valor '${data[column]}' já cadastrado para a coluna '${column}'`,
                    });
                }
            }
        }

        const novaCidade = await Cidade.create(data);

        return res.status(201).json(novaCidade);

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

export default {listar, selecionar, inserir };