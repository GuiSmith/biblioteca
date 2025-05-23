import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

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
    id_uf: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Cidade;
