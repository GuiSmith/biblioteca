import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Uf = sequelize.define('uf', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    sigla: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
});

export default Uf;