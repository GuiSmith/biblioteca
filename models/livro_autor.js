import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const LivroAutor = sequelize.define('livro_autor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    id_livro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_autor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default LivroAutor;