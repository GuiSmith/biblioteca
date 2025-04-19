import dotenv from "dotenv";

import { Sequelize } from "sequelize";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

// Tenta a conexão com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao conectar com o banco de dados:", error);
    });

export default sequelize;