import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Usuario from "./usuario.js";
import Livro from "./livro.js";

const Reserva = sequelize.define('reserva', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_reserva: {
        type: DataTypes.DATE,
        allowNull: false
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

Reserva.belongsTo(Usuario, {
    constraint: true,
    foreignKey: 'id_usuario',
});

Usuario.hasMany(Reserva, {
    constraint: true,
    foreignKey: 'id_usuario',
});
Reserva.belongsTo(Livro, {
    constraint: true,
    foreignKey: 'id_livro',
});

Livro.hasMany(Reserva, {
    constraint: true,
    foreignKey: 'id_livro',
});
