import { DataTypes } from "sequelize";
import sequelize from "../banco.js";


const Livro = sequelize.define("livro", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    sinopse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    enredo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

export default Livro;