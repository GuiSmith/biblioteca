// ==================== Principais Entidades ====================
import Usuario from './usuario.js';
import Token from './token.js';
// ==================== DADOS CADASTRAIS ====================
import Cidade from './cidade.js';
import Uf from './uf.js';
// Endereços
import EnderecoEditora from './endereco_editora.js';
import EnderecoFornecedor from './endereco_fornecedor.js';
import EnderecoUsuario from './endereco_usuario.js';
// Telefones
import TelefoneUsuario from './telefone_usuario.js';
import TelefoneFornecedor from './telefone_fornecedor.js';
import TelefoneEditora from './telefone_editora.js';
// ==================== LIVROS ====================
import Autor from './autor.js';
import Fornecedor from './fornecedor.js';
import Editora from './editora.js';
import Categoria from './categoria.js';
import Livro from './livro.js';
import LivroAutor from './livro_autor.js';
import ExemplarEditora from './exemplar_editora.js';
import Exemplar from './exemplar.js';
import Entrada from './entrada.js';
import Reserva from './reserva.js';
import Emprestimo from './emprestimo.js';

// ==================== PRINCIPAIS ENTIDADES ====================

// Usuário e Token
Token.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario', });
Usuario.hasMany(Token, { foreignKey: 'id_usuario', });

// Usuário e Empréstimo
Usuario.hasMany(Emprestimo, { foreignKey: 'id_usuario' });
Emprestimo.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' });

// ==================== DADOS CADASTRAIS ====================

// Cidade e UF
Cidade.belongsTo(Uf, { as: 'uf', foreignKey: 'id_uf' });
Uf.hasMany(Cidade, { foreignKey: 'id_uf' });

// Endereço e Usuário
EnderecoUsuario.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
Usuario.hasMany(EnderecoUsuario, { foreignKey: 'id_usuario' });

// Endereço e Editora
EnderecoEditora.belongsTo(Editora, { as: 'editora', foreignKey: 'id_editora' });
Editora.hasMany(EnderecoEditora, { foreignKey: 'id_editora' });

// Endereço e Fornecedor
EnderecoFornecedor.belongsTo(Fornecedor, { as: 'fornecedor', foreignKey: 'id_fornecedor' });
Fornecedor.hasMany(EnderecoFornecedor, { foreignKey: 'id_fornecedor' });

// Endereço de usuário e Cidade
EnderecoUsuario.belongsTo(Cidade, { as: 'cidade', foreignKey: 'id_cidade' });
Cidade.hasMany(EnderecoUsuario, { foreignKey: 'id_cidade' });

// Endereço de editora e Cidade
EnderecoEditora.belongsTo(Cidade, { as: 'cidade', foreignKey: 'id_cidade' });
Cidade.hasMany(EnderecoEditora, { foreignKey: 'id_cidade' });

// Endereço de usuário e Cidade
EnderecoFornecedor.belongsTo(Cidade, { as: 'cidade', foreignKey: 'id_cidade' });
Cidade.hasMany(EnderecoFornecedor, { foreignKey: 'id_cidade' });

// Telefone e Usuário
TelefoneUsuario.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' });
Usuario.hasMany(TelefoneUsuario, { foreignKey: 'id_usuario' });

// Telefone e Fornecedor
TelefoneFornecedor.belongsTo(Fornecedor, { as: 'fornecedor', foreignKey: 'id_fornecedor' });
Fornecedor.hasMany(TelefoneFornecedor, { foreignKey: 'id_fornecedor' });

// Telefone e Editora
TelefoneEditora.belongsTo(Editora, { as: 'editora', foreignKey: 'id_editora' });
Editora.hasMany(TelefoneEditora, { foreignKey: 'id_editora' });

// ==================== LIVROS ====================

// Livro e Autor (relação muitos-para-muitos)
Livro.belongsToMany(Autor, { through: "livro_autor", foreignKey: "id_livro" });
Autor.belongsToMany(Livro, { through: "livro_autor", foreignKey: "id_autor" });

// Livro e Exemplar
Livro.hasMany(Exemplar, { foreignKey: 'id_livro' });
Exemplar.belongsTo(Livro, { as: 'livro', foreignKey: 'id_livro' });

// Livro e Categoria
Livro.belongsTo(Categoria, { as: 'categoria', foreignKey: 'id_categoria' });
Categoria.hasMany(Livro, { foreignKey: 'id_categoria' });

// Livro e Reserva
Reserva.belongsTo(Livro, { as: 'livro', foreignKey: 'id_livro' });
Livro.hasMany(Reserva, { foreignKey: 'id_livro' });

// Entrada e Exemplar
Entrada.hasMany(Exemplar, { foreignKey: 'id_entrada' });
Exemplar.belongsTo(Entrada, { as: 'entrada', foreignKey: 'id_entrada' });

// Fornecedor e Exemplar
Fornecedor.hasMany(Exemplar, { foreignKey: 'id_fornecedor' });
Exemplar.belongsTo(Fornecedor, { as: 'fornecedor', foreignKey: 'id_fornecedor' });

// Editora e Exemplar