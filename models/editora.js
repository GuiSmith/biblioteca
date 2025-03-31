import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Editora = sequelize.define("editora", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cnpj: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
});

export default Editora;