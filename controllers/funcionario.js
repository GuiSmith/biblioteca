// Modelos
import Funcionario from '../models/funcionario.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    return await Funcionario.findAll()
        .then(result => res.status(result.length > 0 ? 200 : 204).json(result))
        .catch(erro => res.status(500).json({
            mensagem: "Erro ao listar funcionários",
            erro: erro
        }));
};

const selecionar = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'Informe o ID do funcionário'
        });
    }
    const id = req.params.id;

    // Verifica se o funcionário existe
    const funcionarioExistente = await Funcionario.findByPk(id);
    if (!funcionarioExistente) {
        return res.status(404).json({
            mensagem: `Funcionário com ID ${id} não encontrado`
        });
    }

    return res.status(200).json(funcionarioExistente);

};

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Funcionario.getTableName());
    const permittedColumns = await util.permittedColumns(Funcionario.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if (!util.keysMatch(data, requiredColumns)) {
        res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Verifica se o CPF é válido
    if (data.cpf) {
        const novoCPF = util.normalizarCPF(data.cpf);
        if (util.validarCPF(novoCPF)) {
            data.cpf = novoCPF;
        } else {
            return res.status(400).json({
                mensagem: 'CPF inválido',
                cpf: data.cpf
            });
        }
    }

    // Verifica chaves únicas
    const uniqueColumns = await util.uniqueColumns(Funcionario.getTableName());

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await util.checkUniqueColumn(Funcionario, column, data[column]);
            if (exists) {
                return res.status(409).json({
                    mensagem: `O valor para o dado '${column}' já está em uso`,
                    dado: column,
                    valor: data[column]
                });
            }
        }
    }

    if (data.senha) {
        data.senha = await util.criptografarSenha(data.senha);
    }

    return await Funcionario.create(data)
        .then(result => res.status(201).json(result))
        .catch(erro => res.status(500).json({
            mensagem: "Erro ao inserir funcionário",
            erro: erro
        }))
}

const alterar = async (req, res) => {
    // Verificando se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: `Informe o ID do funcionário`
        });
    }
    const id = req.params.id;

    // Verificando se o funcionário existe
    const funcionarioExistente = Funcionario.findByPk(id);
    if (!funcionarioExistente) {
        return res.status(409).json({
            mensagem: `Funcionário com ID ${id} não foi encontrado`
        });
    }

    const permittedColumns = await util.permittedColumns(Funcionario.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    // Verifica se o CPF é válido
    if (data.cpf) {
        const novoCPF = util.normalizarCPF(data.cpf);
        if (util.validarCPF(novoCPF)) {
            data.cpf = novoCPF;
        } else {
            return res.status(400).json({
                mensagem: 'CPF inválido',
                cpf: data.cpf
            });
        }
    }

    // Verifica chaves únicas
    const uniqueColumns = await util.uniqueColumns(Funcionario.getTableName());

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await util.checkUniqueColumn(Funcionario, column, data[column]);
            if (exists) {
                return res.status(409).json({
                    mensagem: `O valor para o dado '${column}' já está em uso`,
                    dado: column,
                    valor: data[column]
                });
            }
        }
    }

    if (data.senha) {
        data.senha = await util.criptografarSenha(data.senha);
    }

    return await Funcionario.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: "Funcionário alterado com sucesso"
        }))
        .catch(erro => res.status(500).json({
            mensagem: 'Houve um erro ao atualizar funcionário',
            erro: erro
        }));

}

const demitir = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'Informe o ID do funcionário'
        });
    }
    const id = req.params.id;

    // Verifica se o funcionário existe
    const funcionarioExistente = await Funcionario.findByPk(id);
    if (!funcionarioExistente) {
        return res.status(404).json({
            mensagem: `Funcionário com ID ${id} não encontrado`
        });
    }else{
        if(funcionarioExistente.dataValues.ativo == false && funcionarioExistente.dataValues.data_demissao != null){
            return res.status(409).json({
                mensagem: `Funcionário já está demitido`,
                funcionario: {
                    ativo: funcionarioExistente.dataValues.ativo,
                    data_demissao: funcionarioExistente.dataValues.data_demissao
                }
            });
        }
    }

    // Filtrando dados
    const dadosObrigatorios = ['data_demissao'];
    const data = util.filterObjectKeys(req.body, dadosObrigatorios);
    if (!util.keysMatch(data, dadosObrigatorios)) {
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: dadosObrigatorios,
            informados: Object.keys(data)
        });
    }

    data.ativo = false;

    return await Funcionario.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: 'Funcionário demitido com sucesso'
        }))
        .catch(erro => res.status(500).json({
            mensagem: 'Erro ao demitir funcionário',
            erro: erro
        }))
}

export default { listar, selecionar, inserir, alterar, demitir };