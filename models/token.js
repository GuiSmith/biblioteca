import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';

const Token = sequelize.define('token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    data_expiracao: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Token;