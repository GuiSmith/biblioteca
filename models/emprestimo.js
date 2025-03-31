import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Usuario from "./usuario.js";
import Exemplar from "./exemplar.js";

const Emprestimo = sequelize.define('emprestimo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_emprestimo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_prevista_devolucao: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    data_devolucao: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Emprestimo.belongsTo(Usuario, {
    constraint: true,
    foreignKey: 'id_usuario'
});

Emprestimo.belongsTo(Exemplar, {
    constraint: true,
    foreignKey: 'id_exemplar'
});

Usuario.hasMany(Emprestimo, {
    foreignKey: 'id_usuario',
    constraint: true
});

Exemplar.hasMany(Emprestimo, {
    foreignKey: 'id_exemplar',
    constraint: true
});

export default Emprestimo;