import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Emprestimo = sequelize.define('emprestimo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_emprestimo: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    data_prevista_devolucao: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    data_devolucao: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_reserva: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

export default Emprestimo;