-- Categoria
CREATE TABLE categoria(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Autor
CREATE TABLE autor(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    biografia TEXT,
    nacionalidade VARCHAR(10) NOT NULL,
    foto VARCHAR(100),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Editora
CREATE TABLE editora (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(15) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Livro
CREATE TABLE livro (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    foto VARCHAR(100),
    sinopse TEXT,
    enredo TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
