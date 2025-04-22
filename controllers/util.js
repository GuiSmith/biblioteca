import sequelize from "../banco.js";
import { isMatch } from "date-fns";
import bcrypt from 'bcrypt';

const tabelas = async (req, res) => {
    try {
        const tables = await sequelize.getQueryInterface().showAllTables();
        const hasTables = tables && tables.length > 0;

        res.status(hasTables ? 200 : 204).json({
            ok: true,
            message: hasTables ? 'Lista de tabelas' : 'Nenhuma tabela encontrada',
            tables: tables,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Erro ao listar tabelas',
            error: error.message,
        });
    }
};

const colunas = async (req, res) => {
    try {
        const { tabela } = req.params;
        if (!tabela) {
            return res.status(400).json({
                message: 'Nome da tabela não fornecido',
                params: req.params
            });
        }

        const columns = await sequelize.getQueryInterface().describeTable(tabela);

        console.log(columns);

        const formattedColumns = Object.entries(columns).map(([name, details]) => {
            return {
            name,
            allowNull: details.allowNull,
            defaultValue: details.defaultValue,
            type: details.type,
            length: details.type.match(/\((\d+)\)/)?.[1] || null,
            enumValues: details.type == 'USER-DEFINED' ? details.special : null,
            };
        });

        const permitted = await permittedColumns(tabela);
        const required = await requiredColumns(tabela);

        res.status(200).json({
            mensagem: 'Lista de colunas',
            permitidas: permitted,
            obrigatorias: required,
            colunas: formattedColumns,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao listar colunas',
            error: error,
        });
    }
};

const requiredColumns = async (table) => {
    return sequelize.getQueryInterface().describeTable(table)
        .then((columns) => {
            return Object.entries(columns)
                .filter(([name, details]) => details.allowNull === false && name.toLowerCase() !== 'id')
                .map(([name]) => name);
        })
        .catch((error) => {
            console.log(`Erro ao obter colunas obrigatórias: ${error}`);
        });
};

const permittedColumns = async (table) => {
    return sequelize.getQueryInterface().describeTable(table)
        .then((columns) => {
            return Object.entries(columns)
                .filter(([name,details]) => name.toLocaleLowerCase() !== 'id' && name.toLocaleLowerCase() !== 'createdat' && name.toLocaleLowerCase() !== 'updatedat')
                .map(([name]) => name);
        })
        .catch((error) => {
            console.log(`Erro ao obter colunas permitidas: ${error}`);
        });
}

const uniqueColumns = async (table) => {
    try {
        const indexes = await sequelize.getQueryInterface().showIndex(table);

        const uniqueIndexes = indexes
            .filter(index => index.unique && !index.primary)
            .map(index => (
                index.fields[0].attribute
            ));
        
        return [...new Set(uniqueIndexes)];

    } catch (error) {
        console.error(`Erro ao obter colunas únicas: ${error}`);
        return [];
    }
};

const checkUniqueColumn = async (Model, column, value, id = null) => {

    const register = await Model.findOne({
        where: { [column]: value }
    });

    if(register){
        if(id){
            if(register.dataValues.id == id){
                return false;
            }
        }
        return true;
    }
}

const isNumber = (value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return false;
    return parsed.toString() === String(value);
};

const filterObjectKeys = (obj, array) => {
    const result = {};
    for (const key of array) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    return result;
};

const keysMatch = (obj, array) => {
    for (const key of array) {
        if (!obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

const httpCodes = {
    ok: 200,
    created: 201,
    no_content: 204,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
    server_error: 500
};

const normalizarCPF = (cpf) => {
    if (typeof cpf !== 'string') {
        return null;
    }
    return cpf.replace(/\D/g, '');
}

const validarCPF = (cpf) => {
    if (typeof cpf !== 'string') {
        return false;
    }
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
        return false;
    }
    const regex = /^(?!0+$)\d{11}$/;
    return regex.test(cpf);
}

const normalizarCNPJ = (cnpj) => {
    if (typeof cnpj !== 'string') {
        return null;
    }
    return cnpj.replace(/\D/g, '');
}

const validarCNPJ = (cnpj) => {
    if (typeof cnpj !== 'string') {
        return false;
    }
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) {
        return false;
    }

    return true;
}

const normalizarTelefone = (telefone) => {
    if (typeof telefone !== 'string') {
        return null;
    }
    return telefone.replace(/\D/g, '');
}

const validarData = (data) => {
    if (typeof data !== 'string') {
        return false;
    }
    
    const dataFormat = 'yyyy-MM-dd';

    return isMatch(data, dataFormat);
}

const criptografarSenha = async (senha) => {
    return await bcrypt.hash(senha, saltRounds);
}

const compararSenha = async (senha, senhaCriptografada) => {
    return await bcrypt.compare(senha, senhaCriptografada);
}

const dataColumns = async (Model) => {
    return Object.entries(await Model.getAttributes())
        .filter(([_, attributes]) => attributes.type.constructor.name === 'DATEONLY')
        .map(([fieldName, _]) => fieldName);
}

// Constantes
const dias_emprestimo = 15;
const saltRounds = 10;

(async () => {
    const data = '2003-03';

    console.log(validarData(data));
})();

export default { tabelas, colunas, requiredColumns, permittedColumns, uniqueColumns, checkUniqueColumn, isNumber, filterObjectKeys, keysMatch, normalizarCPF, normalizarTelefone, validarCPF, normalizarCNPJ, validarCNPJ, validarData, dias_emprestimo, criptografarSenha, compararSenha, dataColumns };