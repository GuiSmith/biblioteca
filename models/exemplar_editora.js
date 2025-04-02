import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const ExemplarEditora = sequelize.define('exemplar_editora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    id_exemplar: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_editora: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default ExemplarEditora;