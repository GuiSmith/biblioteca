import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Categoria = sequelize.define('categoria', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Categoria;