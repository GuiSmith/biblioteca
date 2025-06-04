// Bibliotecas
import { Op } from 'sequelize';

// Modelos
import Editora from '../models/editora.js';
import Exemplar from '../models/exemplar.js';
// Controladores
import util from './util.js';

const listar = async (req, res) => {

    try {
        const editoras = await Editora.findAll();

        if (editoras.length > 0) {
            return res.status(200).json(editoras);
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
        return res.status(200).json(editora);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const inserir = async (req, res) => {
    try {
        // Filtrando data
        const requiredColumns = await util.requiredColumns(Editora.getTableName());
        const permittedColumns = await util.permittedColumns(Editora.getTableName());
        const data = util.filterObjectKeys(req.body, permittedColumns, requiredColumns);

        // Verifica se os data obrigatórios foram informados
        if (!util.keysMatch(data, requiredColumns)) {
            return res.status(400).json({
                mensagem: 'Dados obrigatórios não informados',
                obrigatorios: requiredColumns,
                informados: Object.keys(data),
            });
        }

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

        // Inserindo data
        const novaEditora = await Editora.create(data);

        return res.status(201).json(novaEditora);

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const alterar = async (req, res) => {
    try {
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

        if (data.hasOwnProperty('cnpj')) {
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
                    where: {
                        [column]: data[column],
                        id: { [Op.ne]: id }
                    },
                });

                if (exists) {
                    return res.status(409).json({
                        mensagem: `Valor '${data[column]}' já cadastrado para a coluna '${column}'`,
                    });
                }
            }
        }

        // Atualizando dados
        const [editoraLinhasAtualizadas] = await Editora.update(data, {
            where: { id }
        });

        if (editoraLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: 'Editora atualizada com sucesso',
            });
        }

        throw new Error("Editora não atualizada");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const excluir = async (req, res) => {
    try {
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

        // Verifica se há exemplares com esta editora
        const exemplares = await Exemplar.count({
            where: { id_editora: id}
        });

        if(exemplares > 0){
            return res.status(409).json({
                mensagem: `Não é possível deletar esta editora, pois ela tem exemplares cadastrados`
            });
        }

        // Excluindo editora
        const editoraLinhasExcluidas = await Editora.destroy({
            where: { id }
        });

        if(editoraLinhasExcluidas > 0){
            return res.status(200).json({
                mensagem: 'Editora excluída com sucesso',
            });
        }

        throw new Error("Editora não excluída");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { inserir, listar, selecionar, alterar, excluir };
