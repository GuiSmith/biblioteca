import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';

const TelefoneFornecedor = sequelize.define('telefone_fornecedor', {
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
    id_fornecedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default TelefoneFornecedor;