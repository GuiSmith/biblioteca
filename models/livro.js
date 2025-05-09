// Importar biblioteca que tem os tipos de dados das colunas do banco de dados
import { DataTypes } from "sequelize";
// Importar a conexão com o banco de dados
import sequelize from "../banco.js";

const Livro = sequelize.define("livro", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    foto: {
        type: DataTypes.TEXT,
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
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Livro;