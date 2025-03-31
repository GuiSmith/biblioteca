import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Usuario from "./usuario.js";

const Entrada = sequelize.define('entrada', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

Entrada.belongsTo(Usuario, {
    constraint: false,
    foreignKey: 'id_usuario',
});

Usuario.hasMany(Entrada, {
    foreignKey: 'id_entrada',
});

export default Entrada;