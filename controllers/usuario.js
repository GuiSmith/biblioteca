// Modelos
import Usuario from '../models/usuario.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    const usuarios = await Usuario.findAll();
    return res.status(usuarios.length > 0 ? 200 : 204).json(usuarios);
};

const selecionar = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'ID não informado'
        });
    }
    const { id } = req.params;
    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({
            mensagem: 'ID não é número'
        });
    }
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return res.status(404).json({
            mensagem: `Usuário com ID ${id} não encontrado!`
        });
    }

    return res.status(200).json(usuario);
}

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Usuario.getTableName());
    const permittedColumns = await util.permittedColumns(Usuario.getTableName());

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

    if (data.senha) {
        if (data.senha.length < 6 || data.senha.length > 20) {
            return res.status(400).json({
                mensagem: `A senha deve ter entre 6 e 20 caracteres`
            });
        }
        data.senha = await util.criptografarSenha(data.senha);
    }

    // Verifica chaves únicas
    const uniqueColumns = await util.uniqueColumns(Usuario.getTableName());

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await util.checkUniqueColumn(Usuario, column, data[column]);
            if (exists) {
                return res.status(409).json({
                    mensagem: `O valor para o dado '${column}' já está em uso`,
                    dado: column,
                    valor: data[column]
                });
            }
        }
    }


    try {
        const usuario = await Usuario.create(data);
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao inserir usuário',
            erro: error.message
        });
    }
};

const alterar = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'ID não informado'
        });
    }

    const { id } = req.params;

    // Verifica se o ID é um número
    if (!util.isNumber(id)) {
        return res.status(400).json({
            mensagem: 'ID não é número'
        });
    }

    // Verifica se o usuário existe

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return res.status(404).json({
            mensagem: `Usuário com ID ${id} não encontrado!`
        });
    }

    // Filtrando dados
    const permittedColumns = await util.permittedColumns(Usuario.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

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

    // Verifica os valores unicos
    const uniqueColumns = await util.uniqueColumns(Usuario.getTableName());

    console.log(uniqueColumns);

    for (const column of uniqueColumns) {
        if (data[column]) {
            const exists = await util.checkUniqueColumn(Usuario, column, data[column], id);
            console.log(id, column, data[column], exists);
            if (exists) {
                return res.status(400).json({
                    mensagem: `O valor para o dado '${column}' já está em uso`,
                    dado: column,
                    valor: data[column]
                });
            }
        }
    }

    if (data.senha) {
        if (data.senha.length < 6 || data.senha.length > 20) {
            return res.status(400).json({
                mensagem: `A senha deve ter entre 6 e 20 caracteres`
            });
        }
        data.senha = await util.criptografarSenha(data.senha);
    }

    try {
        const usuario = await Usuario.update(data, {
            where: { id }
        });

        return res.status(200).json({
            mensagem: `Usuário com ID ${id} alterado com sucesso!`,
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao alterar usuário',
            erro: error.message
        });
    }
};

const definirSenha = async (req, res) => {
    // Verifica se o ID foi informado
    if (!req.params.id) {
        return res.status(400).json({
            mensagem: 'Informe o ID do usuário'
        });
    }
    const id = req.params.id;

    // Verifica se o usuário existe
    const usuarioExistente = await Usuario.findByPk(id);
    if (!usuarioExistente) {
        return res.status(404).json({
            mensagem: `Usuário com ID ${id} não encontrado`
        });
    }

    // Filtrando dados
    const dadosObrigatorios = ['senha'];
    const data = util.filterObjectKeys(req.body, dadosObrigatorios);
    if (!util.keysMatch(data, dadosObrigatorios)) {
        return res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: dadosObrigatorios,
            informados: Object.keys(data)
        });
    }

    if (data.senha) {
        if (data.senha.length < 6 || data.senha.length > 20) {
            return res.status(400).json({
                mensagem: `A senha deve ter entre 6 e 20 caracteres`
            });
        }
        data.senha = await util.criptografarSenha(data.senha);
    }

    data.token = '';

    return await Usuario.update(data, {
        where: { id }
    })
        .then(result => res.status(200).json({
            mensagem: 'Senha definida com sucesso'
        }))
        .catch(erro => res.status(500).json({
            mensagem: 'Erro ao definir senha',
            erro: erro
        }))
}

export default { listar, selecionar, inserir, alterar, definirSenha };