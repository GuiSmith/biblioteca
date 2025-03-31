import { DataTypes } from 'sequelize';
import sequelize from '../banco.js';

import Usuario from './usuario.js';
import Editora from './editora.js';
import Fornecedor from './fornecedor.js';

const Telefone = sequelize.define('telefone', {
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
});

Telefone.belongsTo(Usuario, {
    constraint: false,
    foreignKey: 'id_usuario',
});

Usuario.hasMany(Telefone, {
    foreignKey: 'id_usuario',
    constraint: false,
});

Telefone.belongsTo(Editora, {
    constraint: false,
    foreignKey: 'id_editora',
});

Editora.hasMany(Telefone, {
    foreignKey: 'id_editora',
    constraint: false,
});

Telefone.belongsTo(Fornecedor, {
    constraint: false,
    foreignKey: 'id_fornecedor',
});

Fornecedor.hasMany(Telefone, {
    foreignKey: 'id_fornecedor',
    constraint: false,
});

export default Telefone;