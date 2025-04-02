import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

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

export default Exemplar;