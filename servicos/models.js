import Autor from '../models/autor.js';
import Categoria from '../models/categoria.js';
import Editora from '../models/editora.js';
import Emprestimo from '../models/emprestimo.js';
import Exemplar from '../models/exemplar.js';
import Funcionario from '../models/funcionario.js';
import Livro from '../models/livro.js';
import LivroAutor from '../models/livro_autor.js';
import Reserva from '../models/reserva.js';
import Usuario from '../models/usuario.js';

const models = {
  autor: Autor,
  categoria: Categoria,
  editora: Editora,
  emprestimo: Emprestimo,
  exemplar: Exemplar,
  funcionario: Funcionario,
  livro: Livro,
  livroAutor: LivroAutor,
  reserva: Reserva,
  usuario: Usuario
};


export default models;