import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Funcionario = sequelize.define('funcionario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    foto: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    salario: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: true,
    },
    data_contratacao: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    data_demissao: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

export default Funcionario;