// Modelos
import '../models/relacionamentos.js';
import Funcionario from '../models/funcionario.js';

// Controladores
import util from './util.js';

const listar = async (req, res) => {
    try {
        const result = await Funcionario.findAll();

        if (result.length > 0) {
            return res.status(200).json(result);
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno",
            error
        });
    }
};

const selecionar = async (req, res) => {
    try {
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
            if (data.senha.length < 6 || data.senha.length > 20) {
                return res.status(400).json({
                    mensagem: `A senha deve ter entre 6 e 20 caracteres`
                });
            }
            data.senha = await util.criptografarSenha(data.senha);
        }

        const novoFuncionario = await Funcionario.create(data);

        return res.status(201).json(novoFuncionario);
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const alterar = async (req, res) => {
    try {
        // Verificando se o ID foi informado
        if (!req.params.id) {
            return res.status(400).json({
                mensagem: `Informe o ID do funcionário`
            });
        }
        const id = req.params.id;

        // Verificando se o funcionário existe
        const funcionarioExistente = await Funcionario.findByPk(id);
        if (!funcionarioExistente) {
            return res.status(409).json({
                mensagem: `Funcionário com ID ${id} não foi encontrado`
            });
        }

        const permittedColumns = await util.permittedColumns(Funcionario.getTableName());

        const data = util.filterObjectKeys(req.body, permittedColumns);

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

        // Verifica chaves únicas
        const uniqueColumns = await util.uniqueColumns(Funcionario.getTableName());

        for (const column of uniqueColumns) {
            if (data.hasOwnProperty(column)) {
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

        if (data.hasOwnProperty('senha')) {
            if (data.senha.length < 6 || data.senha.length > 20) {
                return res.status(400).json({
                    mensagem: `A senha deve ter entre 6 e 20 caracteres`
                });
            }
            data.senha = await util.criptografarSenha(data.senha);
        }

        const [funcionarioLinhasAtualizadas] = await Funcionario.update(data, {
            where: { id }
        });

        if (funcionarioLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: "Funcionário alterado com sucesso"
            })
        }

        throw new Error("Funcionário não atualizado");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }

}

const demitir = async (req, res) => {
    try {
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
        } else {
            if (funcionarioExistente.dataValues.ativo == false && funcionarioExistente.dataValues.data_demissao != null) {
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

        const [funcionarioLinhasAtualizadas] = await Funcionario.update(data, {
            where: { id }
        })

        if (funcionarioLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: 'Funcionário demitido com sucesso'
            });
        }

        throw new Error("Funcionário não demitido");

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

const definirSenha = async (req, res) => {
    try {
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

        const [funcionarioLinhasAtualizadas] = await Funcionario.update(data, {
            where: { id }
        })

        if (funcionarioLinhasAtualizadas > 0) {
            return res.status(200).json({
                mensagem: 'Senha definida com sucesso'
            });
        }

        throw new Error("Senha não definida");
    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
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

        // Buscando funcionário

        const funcionarioExistente = await Funcionario.findOne({
            where: { email: data.email },
            raw: true
        });

        if(!funcionarioExistente){
            return res.status(404).json({
                mensagem: `Funcionário não encontrado!`
            });
        }

        // Verificando se funcionário está inativo
        if (funcionarioExistente.ativo == false) {
            return res.status(409).json({
                mensagem: "Não é possível fazer login de funcionário inativo"
            });
        }

        // Verificando se funcionário não tem e-mail ou senha
        if (funcionarioExistente.email == null || funcionarioExistente.senha == null) {
            return res.status(409).json({
                mensagem: "Este funcionário não tem email ou senha registrados",
                funcionario: {
                    email: funcionarioExistente.email,
                    senha: funcionarioExistente.senha
                }
            });
        }

        // Verificando se funcionário digitou a senha correta ou não
        const senhaCorreta = await util.compararSenha(data.senha, funcionarioExistente.senha);
        if (funcionarioExistente.email != data.email || !senhaCorreta) {
            console.log(`email: ${funcionarioExistente.email != data.email}`);
            console.log(`senha: ${senhaCorreta}`);
            return res.status(409).json({
                mensagem: "E-mail ou senha incorretos",
                funcionario: {
                    email: data.email,
                    senha: data.senha
                }
            });
        }

        const token = await util.gerarTokenUnico(Funcionario);

        if(!token){
            throw new Error("Token não gerado corretamente");
        }

        const [funcionarioLinhasAtualizadas] = await Funcionario.update({ token }, {
            where: { id: funcionarioExistente.id }
        });

        if (funcionarioLinhasAtualizadas > 0) {
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

export default { listar, selecionar, inserir, alterar, demitir, definirSenha, login };