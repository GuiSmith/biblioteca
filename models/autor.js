import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Autor = sequelize.define('autor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
    },
    biografia: {
        type: DataTypes.TEXT,
    },
    nacionalidade: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING(100),
    },
});

export default Autor;