import sequelize from "../banco.js";

const tabelas = async (req, res) => {
    try {
        const tabelas = await sequelize.getQueryInterface().showAllTables();
        const hasTables = tabelas && tabelas.length > 0;

        res.status(hasTables ? 200 : 204).json({
            ok: true,
            mensagem: hasTables ? 'Lista de tabelas' : 'Nenhuma tabela encontrada',
            tabelas: tabelas,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensagem: 'Erro ao listar tabelas',
            erro: error.message,
        });
    }
}

const colunas = async (req, res) => {
    try {
        const { tabela } = req.params;
        if (!tabela) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Nome da tabela não fornecido',
            });
        }

        const colunas = await sequelize.getQueryInterface().describeTable(tabela);

        const colunasFormatadas = Object.entries(colunas).map(([nome, detalhes]) => ({
            nome,
            allowNull: detalhes.allowNull,
            defaultValue: detalhes.defaultValue,
            type: detalhes.type,
            length: detalhes.type.match(/\((\d+)\)/)?.[1] || null,
        }));

        res.status(200).json({
            ok: true,
            mensagem: 'Lista de colunas',
            colunas: colunasFormatadas,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensagem: 'Erro ao listar colunas',
            erro: error.message,
        });
    }
}

export default { tabelas, colunas };