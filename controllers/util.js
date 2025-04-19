import sequelize from "../banco.js";

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
        const { table } = req.params;
        if (!table) {
            return res.status(400).json({
                ok: false,
                message: 'Nome da tabela não fornecido',
            });
        }

        const columns = await sequelize.getQueryInterface().describeTable(table);

        const formattedColumns = Object.entries(columns).map(([name, details]) => ({
            name,
            allowNull: details.allowNull,
            defaultValue: details.defaultValue,
            type: details.type,
            length: details.type.match(/\((\d+)\)/)?.[1] || null,
        }));

        res.status(200).json({
            ok: true,
            message: 'Lista de colunas',
            columns: formattedColumns,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Erro ao listar colunas',
            error: error.message,
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



export default { tabelas, colunas, requiredColumns, permittedColumns, isNumber, filterObjectKeys, keysMatch };