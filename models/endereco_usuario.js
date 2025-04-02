import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const EnderecoUsuario = sequelize.define('endereco_usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    logradouro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_cidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default EnderecoUsuario;