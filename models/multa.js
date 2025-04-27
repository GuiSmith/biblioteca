import { DataTypes } from "sequelize";
import sequelize from '../banco.js';

const Multa = sequelize.define('multa', {
	id: { 
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	valor: {
		type: DataTypes.DECIMAL(15,2),
		allowNull: false,
	},
	id_usuario: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	id_emprestimo: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	data_vencimento: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	status: {
        type: DataTypes.ENUM('A', 'C', 'R'),
        defaultValue: 'A'
    },
    data_pagamento: {
    	type: DataTypes.DATEONLY,
    	allowNull: true,
    }
});

export default Multa;