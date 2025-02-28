-- Usuários 
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(100),
    cnpj VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    matricula VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    senha VARCHAR(100) NOT NULL,
    foto VARCHAR(100),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tokens
CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    id_usuario INT,
    FOREIGN KEY id_usuario REFERENCES usuario(id)
);
-- Telefones
CREATE TABLE telefone (
    id SERIAL PRIMARY KEY,
    telefone VARCHAR(100),
    id_usuario INT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY id_usuario REFERENCES usuario(id)
);
-- Estados (UFs)
CREATE TABLE uf(
    id SERIAL PRIMARY KEY,
    id_ibge BIGINT NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(10) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Cidades
CREATE TABLE cidade(
    id SERIAL PRIMARY KEY,
    id_ibge BIGINT NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Endereços
CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(100) NOT NULL,
    id_uf INT,
    id_cidade INT,
    id_usuario INT,
    id_editora INT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY id_uf REFERENCES uf(id),
    FOREIGN KEY id_cidade REFERENCES cidade(id),
    FOREIGN KEY id_usuario REFERENCES usuario(id),
    FOREIGN KEY id_editora REFERENCES editora(id)
);
