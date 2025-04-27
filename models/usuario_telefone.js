import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';

const UsuarioTelefone = sequelize.define('usuario_telefone', {
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
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default UsuarioTelefone;