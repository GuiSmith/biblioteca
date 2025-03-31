import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Livro from "./livro.js";
import Entrada from "./entrada.js";
import Fornecedor from "./fornecedor.js";
import Usuario from "./usuario.js";

const Exemplar = sequelize.define('exemplar', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    condicao_fisica: {
        type: DataTypes.ENUM('N', 'U', 'D', 'R'), // Novo, Usado, Danificado, Recondicionado
        allowNull: false,
        defaultValue: 'N',
    },
    edicao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_aquisicao: {
        type: DataTypes.DATE,
        allowNull: true
    },
    valor_bem: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    situacao: {
        type: DataTypes.ENUM('D','E','M','P','V','I'), // Disponível, Emprestado, Manutenção, Perdido, Vendido, Inutilizado
        allowNull: false,
        defaultValue: 'D'
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Exemplar.belongsTo(Livro, {
    constraint: true,
    foreignKey: 'id_livro'
});

Exemplar.belongsTo(Entrada, {
    constraint: false,
    foreignKey: 'id_entrada'
});

Exemplar.belongsTo(Fornecedor, {
    constraint: false,
    foreignKey: 'id_fornecedor'
});

Exemplar.belongsTo(Usuario, {
    constraint: false,
    foreignKey: 'id_usuario'
});

export default Exemplar;