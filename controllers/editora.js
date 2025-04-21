// Modelos
import Editora from '../models/editora.js';
// Controladores
import util from './util.js';

const listar = async (req, res) => {
    return await Editora.findAll()
        .then((result) => {
            const status = result.length > 0 ? 200 : 204;
            res.status(status).json(result);
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao listar editoras',
                error: error.message,
            });
        });
};

const inserir = async (req, res) => {
    // Filtrando data
    const requiredColumns = await util.requiredColumns(Editora.getTableName());
    const permittedColumns = await util.permittedColumns(Editora.getTableName());
    const data = util.filterObjectKeys(req.body, permittedColumns, requiredColumns);

    // Verifica se os data obrigatórios foram informados
    if (!util.keysMatch(data, requiredColumns)) {
        return res.status(400).json({
            mensagem: 'data obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data),
        });
    }

    console.log(data);

    // Verificando CNPJ
    const cnpj = util.normalizarCNPJ(data.cnpj);

    if (!util.validarCNPJ(cnpj)) {
        return res.status(400).json({
            mensagem: 'CNPJ inválido',
            cnpj: data.cnpj,
        });
    }

    data.cnpj = cnpj;

    // Validando chaves únicas
    const uniqueColumns = await util.uniqueColumns(Editora.getTableName());

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await Editora.findOne({
                where: { [column]: data[column] },
            });

            if (exists) {
                return res.status(409).json({
                    mensagem: `Valor '${data[column]}' já cadastrado para a coluna '${column}'`,
                });
            }
        }
    }

    // Inserindo data
    return await Editora.create(data)
        .then((result) => {
            res.status(201).json({
                mensagem: 'Editora inserida com sucesso',
                editora: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao inserir editora',
                error: error.message,
            });
        });
};

const alterar = async (req, res) => {
    // Verifica se foi passado um ID na requisição
    if (!req.params.id) {
        return res.status(400).json({ mensagem: 'ID não informado' });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: 'ID inválido' });
    }
    // Verifica se o ID existe
    const editora = await Editora.findByPk(id);
    if (!editora) {
        return res.status(404).json({ mensagem: 'Editora não encontrada' });
    }

    // Filtrando dados

    const permittedColumns = await util.permittedColumns(Editora.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(data.cnpj){
        // Verificando CNPJ
        const cnpj = util.normalizarCNPJ(data.cnpj);

        if (!util.validarCNPJ(cnpj)) {
            return res.status(400).json({
                mensagem: 'CNPJ inválido',
                cnpj: data.cnpj,
            });
        }

        data.cnpj = cnpj;
    }

    // Validando chaves únicas
    const uniqueColumns = await util.uniqueColumns(Editora.getTableName());

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await Editora.findOne({
                where: { [column]: data[column] },
            });

            if (exists) {
                return res.status(409).json({
                    mensagem: `Valor '${data[column]}' já cadastrado para a coluna '${column}'`,
                });
            }
        }
    }

    // Atualizando dados
    return await editora.update(data)
        .then((result) => {
            res.status(200).json({
                mensagem: 'Editora atualizada com sucesso',
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao atualizar editora',
                error: error.message,
            });
        });
};

const excluir = async (req, res) => {
    // Verifica se foi passado um ID na requisição
    if (!req.params.id) {
        return res.status(400).json({ mensagem: 'ID não informado' });
    }
    const id = req.params.id;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({ mensagem: 'ID inválido' });
    }
    // Verifica se o ID existe
    const editora = await Editora.findByPk(id);
    if (!editora) {
        return res.status(404).json({ mensagem: 'Editora não encontrada' });
    }

    // Excluindo editora
    return await editora.destroy()
        .then(() => {
            res.status(200).json({
                mensagem: 'Editora excluída com sucesso',
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensagem: 'Erro ao excluir editora',
                error: error.message,
            });
        });
}

export default { inserir, listar, alterar, excluir };
