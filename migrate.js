import sequelize from "./banco.js";
// import './models/index.js';
import Funcionario from './models/funcionario.js';

await sequelize.sync({ alter: true });
console.log("Tabelas criadas com sucesso");