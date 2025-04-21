import { DataTypes } from "sequelize";
import sequelize from "../banco.js";

const Reserva = sequelize.define('reserva', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_reserva: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    data_prevista_devolucao: {
        type: DataTypes.DATEONLY,
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Aberta', 'Cancelada', 'Finalizada'),
        defaultValue: 'Aberta'
    },
    id_exemplar: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Reserva;