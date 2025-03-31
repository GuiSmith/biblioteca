import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Fornecedor from "./fornecedor.js";
import Editora from "./editora.js";
import Usuario from "./usuario.js";
import Uf from "./uf.js";

const Endereco = sequelize.define('endereco', {
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
});

// Fornecedor
Endereco.belongsTo(Fornecedor, {
    constraint: false,
    foreignKey: 'id_fornecedor',
});
Fornecedor.hasMany(Endereco, {
    foreignKey: 'id_fornecedor',
});

// Editora
Endereco.belongsTo(Editora, {
    constraint: false,
    foreignKey: 'id_editora',
});
Editora.hasMany(Endereco, {
    foreignKey: 'id_fornecedor',
});

// Usuario
Endereco.belongsTo(Usuario, {
    constraint: false,
    foreignKey: 'id_usuario',
});
Usuario.hasMany(Endereco, {
    foreignKey: 'id_fornecedor',
});

// Cidade
Endereco.belongsTo(Uf, {
    constraint: true,
    foreignKey: 'id_uf',
});
Uf.hasMany(Endereco, {
    constraint: true,
    foreignKey: 'id_uf',
});

export default Endereco;