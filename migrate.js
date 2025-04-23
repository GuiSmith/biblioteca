import sequelize from "./banco.js";
// import './models/index.js';
import './models/index.js';

await sequelize.sync({ alter: true });
console.log("Tabelas criadas com sucesso");