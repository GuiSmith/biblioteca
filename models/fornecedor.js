import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Fornecedor = sequelize.define('fornecedor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Fornecedor;