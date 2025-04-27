import sequelize from "./banco.js";
import './models/emprestimo.js';

await sequelize.sync({ alter: true });
console.log("Tabelas criadas com sucesso");