import { DataTypes } from "sequelize";
import sequelize from "../banco.js";
import uf from "./uf.js";

const Cidade = sequelize.define('cidade', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
});

Cidade.belongsTo(uf, {
    constraint: true,
    foreignKey: 'id_uf',
});

uf.hasMany(Cidade, {
    foreignKey: 'id_uf',
    constraint: true,
});

export default Cidade;
