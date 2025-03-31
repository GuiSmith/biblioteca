import sequelize from "./banco.js";
import './models/index.js';

await sequelize.sync({ force: true });
console.log("Tabelas criadas com sucesso");