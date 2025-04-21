import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Exemplar = sequelize.define('exemplar', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_editora: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_livro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    condicao_fisica: {
        type: DataTypes.ENUM(
                'Novo',
                'Usado',
                'Danificado',
                'Recondicionado'
            ),
        allowNull: false,
        defaultValue: 'Novo',
    },
    edicao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_aquisicao: {
        type: DataTypes.DATE,
        allowNull: true
    },
    situacao: {
        type: DataTypes.ENUM(
            'Disponível',
            'Emprestado',
            'Manutenção',
            'Perdido',
            'Vendido',
            'Inutilizado'
        ),
        allowNull: false,
        defaultValue: 'Disponível'
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default Exemplar;