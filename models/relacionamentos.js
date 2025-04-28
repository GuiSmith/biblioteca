// ==================== Principais Entidades ====================
import Usuario from './usuario.js';
import Funcionario from './funcionario.js';
// ==================== DADOS CADASTRAIS ====================
import Cidade from './cidade.js';
import Uf from './uf.js';
// Endereços
import EditoraEndereco from './editora_endereco.js';
// Telefones
import UsuarioTelefone from './usuario_telefone.js';
// ==================== LIVROS ====================
import Autor from './autor.js';
import Editora from './editora.js';
import Categoria from './categoria.js';
import Livro from './livro.js';
import LivroAutor from './livro_autor.js';
import Exemplar from './exemplar.js';
import Reserva from './reserva.js';
import Emprestimo from './emprestimo.js';
import Multa from './multa.js';

// ==================== PRINCIPAIS ENTIDADES ====================

// Usuário e Empréstimo
Usuario.hasMany(Emprestimo, { foreignKey: 'id_usuario' });
Emprestimo.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' });

// ==================== DADOS CADASTRAIS ====================

// Cidade e UF
Cidade.belongsTo(Uf, { as: 'uf', foreignKey: 'id_uf' });
Uf.hasMany(Cidade, { foreignKey: 'id_uf' });

// Endereço e Editora
EditoraEndereco.belongsTo(Editora, { as: 'editora', foreignKey: 'id_editora' });
Editora.hasMany(EditoraEndereco, { foreignKey: 'id_editora' });

// Endereço de editora e Cidade
EditoraEndereco.belongsTo(Cidade, { as: 'cidade', foreignKey: 'id_cidade' });
Cidade.hasMany(EditoraEndereco, { foreignKey: 'id_cidade' });

// Telefone e Usuário
UsuarioTelefone.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
Usuario.hasMany(UsuarioTelefone, { foreignKey: 'id_usuario' });

// ==================== LIVROS ====================

// Livro e Autor (relação muitos-para-muitos)
Livro.belongsToMany(Autor, { through: LivroAutor, foreignKey: 'id_livro', as: 'livros' });
Autor.belongsToMany(Livro, { through: LivroAutor, foreignKey: 'id_autor', as: 'autores' });
Livro.hasMany(LivroAutor, { foreignKey: 'id_livro' });
LivroAutor.belongsTo(Livro, { as: 'livro', foreignKey: 'id_livro' });
Autor.hasMany(LivroAutor, { foreignKey: 'id_autor' });
LivroAutor.belongsTo(Autor, { as: 'autor', foreignKey: 'id_autor' });

// Livro e Exemplar
Livro.hasMany(Exemplar, { foreignKey: 'id_livro' });
Exemplar.belongsTo(Livro, { as: 'livro', foreignKey: 'id_livro' });

// Livro e Categoria
Livro.belongsTo(Categoria, { as: 'categoria', foreignKey: 'id_categoria' });
Categoria.hasMany(Livro, {as:'livros', foreignKey: 'id_categoria' });

// Exemplar e Reserva
Exemplar.hasMany(Reserva, { foreignKey: 'id_exemplar' });
Reserva.belongsTo(Exemplar, { as: 'exemplar', foreignKey: 'id_exemplar' });

// Editora e exemplar
Editora.hasMany(Exemplar, { foreignKey: 'id_editora' });
Exemplar.belongsTo(Editora, { as: 'editora', foreignKey: 'id_editora' });

// Multa e empréstimo
Emprestimo.hasMany(Multa, { foreignKey: 'id_emprestimo'});
Multa.belongsTo(Emprestimo, { as: 'emprestimo', foreignKey: 'id_emprestimo'});

// Multa e usuário
Usuario.hasMany(Multa, { foreignKey: 'id_usuario'});
Multa.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario'});

// Exemplar e empréstimo
Exemplar.hasMany(Emprestimo, { foreignKey: 'id_exemplar'});
Emprestimo.belongsTo(Exemplar, { as: 'exemplar', foreignKey: 'id_exemplar' });