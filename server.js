import express from "express";
import sequelize from "./banco.js";

import util from './controllers/util.js';
import categoria from "./controllers/categoria.js";
import autor from './controllers/autor.js';
import livro from './controllers/livro.js';

const app = express();
app.use(express.json());

sequelize.authenticate()
    .then(() => console.log("Conexão com o banco de dados estabelecida"))
    .catch((error) => console.log(error));

// Utilitários
app.get('/tabelas', util.tabelas);
app.get('/colunas/:tabela', util.colunas);

// Categoria
app.get('/categoria', categoria.listar);
app.get('/categoria/:id/livros',categoria.listarLivros);
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
app.post('/livro/:id/autores', livro.inserirLivroAutor);
app.put('/livro/:id/autores', livro.alterarLivroAutor);
app.delete('/livro/:id/autores', livro.excluirLivroAutor);

app.listen(5000, () => console.log("API rodando na porta 5000"));