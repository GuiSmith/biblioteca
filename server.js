import express from "express";
import sequelize from "./banco.js";
import './models/index.js';

const app = express();
app.use(express.json());

sequelize.authenticate()
    .then(() => console.log("Conexão com o banco de dados estabelecida"))
    .catch((error) => console.log(error));
    
    app.get('/listar', async (req, res) => {
        try {
            const tabelas = await sequelize.getQueryInterface().showAllTables();
            const hasTables = tabelas && tabelas.length > 0;

            res.status(hasTables ? 200 : 204).json({
                ok: true,
                mensagem: hasTables ? 'Lista de tabelas' : 'Nenhuma tabela encontrada',
                tabelas: tabelas,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                mensagem: 'Erro ao listar tabelas',
                erro: error.message,
            });
        }
    });

    // app.get('/listar/:tabela', (req,res) => {
    //     try {
            
    //     } catch (error) {
            
    //     }
    // });

    (async () => {
        const usuarios = await Usuario.findAll();
        console.log(usuarios);
    })();


app.listen(4000, () => console.log("API rodando na porta 4000"));
