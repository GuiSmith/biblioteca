import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
});

export default Usuario;