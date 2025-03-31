import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

import Autor from "./autor.js";
import Categoria from "./categoria.js";

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

Livro.belongsTo(Autor, {
    constraint: true,
    foreignKey: 'id_autor',
});
Livro.belongsTo(Categoria, {
    constraint: true,
    foreignKey: 'id_categoria',
});

export default Livro;