// Bibliotecas
import express from "express";
import sequelize from "./banco.js";
import cors from 'cors';

// Middlewares
import midCors from "./middlewares/cors.js";
import auth from './middlewares/auth.js';

// Serviços
import servicos from './servicos/search.js';

// Controllers
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

const app = express();

app.use(express.json());
app.use(cors(midCors.corsOptions));
app.use(auth.auth);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => console.log("Conexão com o banco de dados estabelecida"))
    .catch((error) => console.log(error));

app.get('/', (req, res) => {
    console.log('Teste');
    return res.status(204).send();
});

app.get('/search/:tabela',servicos.search);

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
app.get('/exemplar', exemplar.listar);
app.get('/exemplar/:id', exemplar.selecionar);
app.post('/exemplar', exemplar.inserir);
app.put('/exemplar/:id', exemplar.alterar);

// Usuário
app.get('/usuario', usuario.listar);
app.get('/usuario/:id', usuario.selecionar);
app.post('/usuario', usuario.inserir);
app.put('/usuario/:id', usuario.alterar);
app.post('/usuario/:id/senha', usuario.definirSenha);
app.post('/usuario/login', usuario.login);

// Editora
app.get('/editora', editora.listar);
app.get('/editora/:id', editora.selecionar);
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
app.post('/funcionario/login', funcionario.login);

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