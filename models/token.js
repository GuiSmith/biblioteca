import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';
import Usuario from './usuario.js';

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
        type: DataTypes.DATE,
        allowNull: false,
    },
});

Token.belongsTo(Usuario, {
    constraint: true,
    foreignKey: 'id_usuario',
});

Usuario.hasMany(Token, {
    foreignKey: 'id_usuario',
    constraint: true,
})

export default Token;