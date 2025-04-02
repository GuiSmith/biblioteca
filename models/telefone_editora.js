import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';

const TelefoneEditora = sequelize.define('telefone_editora', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    ddd: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    id_editora: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default TelefoneEditora;