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
        type: DataTypes.DATE,
        allowNull: false
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default Reserva;
