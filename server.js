import express from "express";
import sequelize from "./banco.js";
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'https://guismith.github.io/biblioteca',  // Domínio permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
};

app.use(express.json());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

import util from './controllers/util.js';
import categoria from "./controllers/categoria.js";
import autor from './controllers/autor.js';
import livro from './controllers/livro.js';
import livroAutor from './controllers/livroAutor.js';

sequelize.authenticate()
    .then(() => console.log("Conexão com o banco de dados estabelecida"))
    .catch((error) => console.log(error));

// Utilitários
app.get('/tabelas', util.tabelas);
app.get('/colunas/:tabela', util.colunas);

// Categoria
app.get('/categoria', categoria.listar);
app.get('/categoria/:id/livros', categoria.listarLivros);
app.get('/categoria/:id', categoria.selecionar);
app.post('/categoria', categoria.inserir);
app.put('/categoria/:id', categoria.alterar);
app.delete('/categoria/:id', categoria.excluir);

// Autor
app.get('/autor', autor.listar);
app.get('/autor/:id', autor.selecionar);
app.post('/autor', autor.inserir);
app.put('/autor/:id', autor.alterar);
app.delete('/autor/:id', autor.excluir);

// Livro
app.get('/livro', livro.listar);
app.get('/livro/:id', livro.selecionar);
app.post('/livro', livro.inserir);
app.put('/livro/:id', livro.alterar);
app.delete('/livro/:id', livro.excluir);

// Livro autor
app.get('/livro_autor/livros/:id_autor', livroAutor.listarLivros);
app.get('/livro_autor/autores/:id_livro', livroAutor.listarAutores);
app.post('/livro_autor', livroAutor.inserir);
app.put('/livro_autor/:id', livroAutor.alterar);
app.delete('/livro_autor/:id', livroAutor.excluir);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));