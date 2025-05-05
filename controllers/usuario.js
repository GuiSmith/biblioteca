// Modelos
import Usuario from '../models/usuario.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        return res.status(usuarios.length > 0 ? 200 : 204).json(usuarios);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const selecionar = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const inserir = async (req, res) => {
    try {
        // Filtrando dados
        const requiredColumns = await util.requiredColumns(Usuario.getTableName());
        const permittedColumns = await util.permittedColumns(Usuario.getTableName());

        const data = util.filterObjectKeys(req.body, permittedColumns);

        if (!util.keysMatch(data, requiredColumns)) {
            return res.status(400).json({
                mensagem: 'Dados obrigatórios não informados',
                obrigatorios: requiredColumns,
                informados: Object.keys(data)
            });
        }

        // Verifica se o CPF é válido
        if (data.hasOwnProperty('cpf')) {
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

        if (data.hasOwnProperty('senha')) {
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
            if (data.hasOwnProperty(column)) {
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
                error
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const alterar = async (req, res) => {
    try {
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

        if (data.hasOwnProperty('cpf')) {
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

        for (const column of uniqueColumns) {
            if (data.hasOwnProperty(column)) {
                const exists = await util.checkUniqueColumn(Usuario, column, data[column], id);
                if (exists) {
                    return res.status(400).json({
                        mensagem: `O valor para o dado '${column}' já está em uso`,
                        dado: column,
                        valor: data[column]
                    });
                }
            }
        }

        if (data.hasOwnProperty('senha')) {
            if (data.senha.length < 6 || data.senha.length > 20) {
                return res.status(400).json({
                    mensagem: `A senha deve ter entre 6 e 20 caracteres`
                });
            }
            data.senha = await util.criptografarSenha(data.senha);
        }

        const [usuariosLinhasAtualizadas] = await Usuario.update(data, {
            where: { id }
        });

        if (usuariosLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: `Usuário com ID ${id} alterado com sucesso!`,
            });
        }

        throw new Error("Usuário não atualizado");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
};

const definirSenha = async (req, res) => {
    try {
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

        if (data.hasOwnProperty('senha')) {
            if (data.senha.length < 6 || data.senha.length > 20) {
                return res.status(400).json({
                    mensagem: `A senha deve ter entre 6 e 20 caracteres`
                });
            }
            data.senha = await util.criptografarSenha(data.senha);
        }

        data.token = null;

        const [usuariosLinhasAtualizadas] = await Usuario.update(data, {
            where: { id }
        })

        if(usuariosLinhasAtualizadas > 0){
            return res.status(200).json({
                mensagem: 'Senha definida com sucesso'
            });
        }

        throw new Error("Senha não definida");
        
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        })
    }
}

const login = async (req, res) => {
    try {
        // Filtrando dados
        const dadosObrigatorios = ['email', 'senha'];
        const data = util.filterObjectKeys(req.body, dadosObrigatorios);
        if (!util.keysMatch(data, dadosObrigatorios)) {
            return res.status(400).json({
                mensagem: 'Dados obrigatórios não informados',
                obrigatorios: dadosObrigatorios,
                informados: Object.keys(data)
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { email: data.email }
        });

        if(!usuarioExistente){
            return res.status(404).json({
                mensagem: `Usuário não encontrado`
            });
        }

        // Verificando se funcionário está inativo
        if (usuarioExistente.dataValues.ativo == false) {
            return res.status(409).json({
                mensagem: "Não é possível fazer login de funcionário inativo"
            });
        }

        // Verificando se funcionário não tem e-mail ou senha
        if (usuarioExistente.dataValues.email == null || usuarioExistente.dataValues.senha == null) {
            return res.status(409).json({
                mensagem: "Este funcionário não tem email ou senha registrados",
                Usuario: {
                    email: usuarioExistente.dataValues.email,
                    senha: usuarioExistente.dataValues.senha
                }
            });
        }

        // Verificando se funcionário digitou a senha correta ou não
        const senhaCorreta = await util.compararSenha(data.senha, usuarioExistente.dataValues.senha);
        if (usuarioExistente.dataValues.email != data.email || !senhaCorreta) {
            console.log(`email: ${usuarioExistente.dataValues.email != data.email}`);
            console.log(`senha: ${senhaCorreta}`);
            return res.status(409).json({
                mensagem: "E-mail ou senha incorretos",
                Usuario: {
                    email: data.email,
                    senha: data.senha
                }
            });
        }

        const token = await util.gerarTokenUnico(Usuario);

        if(!token){
            throw new Error("Token não gerado corretamente");
        }

        const [UsuarioLinhasAtualizadas] = await Usuario.update({ token }, {
            where: { id }
        });

        if (UsuarioLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: 'Login realizado com sucesso',
                token
            });
        }

        throw new Error("Login não realizado");
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { listar, selecionar, inserir, alterar, definirSenha, login };