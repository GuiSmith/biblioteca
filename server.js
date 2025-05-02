import express from "express";
import sequelize from "./banco.js";
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'https://guismith.github.io/biblioteca',  // Domínio permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Métodos permitidos
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
import exemplar from './controllers/exemplar.js';
import usuario from './controllers/usuario.js';
import editora from './controllers/editora.js';
import reserva from './controllers/reserva.js';
import funcionario from './controllers/funcionario.js';
import emprestimo from './controllers/emprestimo.js';
import multa from './controllers/multa.js';

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
app.get('/livro/:id_livro/exemplares', livro.listarExemplares);
app.post('/livro', livro.inserir);
app.put('/livro/:id', livro.alterar);
app.delete('/livro/:id', livro.excluir);

// Livro autor
app.get('/livro_autor/livros/:id_autor', livroAutor.listarLivros);
app.get('/livro_autor/autores/:id_livro', livroAutor.listarAutores);
app.post('/livro_autor', livroAutor.inserir);
app.put('/livro_autor/:id', livroAutor.alterar);
app.delete('/livro_autor/:id', livroAutor.excluir);

// Exemplar
app.get('/exemplar/:id', exemplar.selecionar);
app.post('/exemplar', exemplar.inserir);
app.put('/exemplar/:id', exemplar.alterar);
app.delete('/exemplar/:id', exemplar.excluir);

// Usuário
app.get('/usuario', usuario.listar);
app.get('/usuario/:id', usuario.selecionar);
app.post('/usuario', usuario.inserir);
app.put('/usuario/:id', usuario.alterar);
app.post('/usuario/:id/senha', usuario.definirSenha);

// Editora
app.get('/editora', editora.listar);
app.post('/editora', editora.inserir);
app.put('/editora/:id', editora.alterar);
app.delete('/editora/:id', editora.excluir);

// Reserva
app.get('/reserva', reserva.listar);
app.post('/reserva', reserva.inserir);
app.put('/reserva/:id', reserva.alterar);
app.delete('/reserva/:id', reserva.excluir);

// Funcionários
app.get('/funcionario',funcionario.listar);
app.get('/funcionario/:id', funcionario.selecionar);
app.post('/funcionario', funcionario.inserir);
app.put('/funcionario/:id', funcionario.alterar);
app.patch('/funcionario/:id/demitir', funcionario.demitir);
app.post('/funcionario/:id/senha', funcionario.definirSenha);
app.post('/funcionario/:id/login', funcionario.login);

// Emprestimo
app.get('/emprestimo', emprestimo.listar);
app.get('/emprestimo/:id', emprestimo.selecionar);
app.post('/emprestimo', emprestimo.inserir);
app.put('/emprestimo/:id', emprestimo.alterar);
app.patch('/emprestimo/:id/devolver', emprestimo.devolver);
app.patch('/emprestimo/:id/renovar', emprestimo.renovar);

// Multa
app.get('/multa', multa.listar);
app.get('/multa/:id', multa.selecionar);
app.post('/multa', multa.inserir);
app.put('/multa/:id', multa.alterar);
app.delete('/multa/:id', multa.excluir);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));