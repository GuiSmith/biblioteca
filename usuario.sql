-- Usuários 
CREATE TABLE biblioteca.usuario (
    matricula BIGSERIAL,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    senha VARCHAR(100),
    foto VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario PRIMARY KEY (matricula)
);
-- Tokens
CREATE TABLE biblioteca.token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NOT NULL,
    matricula_usuario BIGINT,
    FOREIGN KEY (matricula_usuario) REFERENCES biblioteca.usuario(matricula)
);
-- Telefones
CREATE TABLE biblioteca.telefone (
    id SERIAL PRIMARY KEY,
    telefone VARCHAR(100),
    matricula_usuario BIGINT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (matricula_usuario) REFERENCES biblioteca.usuario(matricula)
);
-- Estados (UFs)
CREATE TABLE biblioteca.uf(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(10) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Cidades
CREATE TABLE biblioteca.cidade(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Endereços
CREATE TABLE biblioteca.endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(100) NOT NULL,
    id_uf INT,
    id_cidade INT,
    matricula_usuario BIGINT,
    id_editora INT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_uf) REFERENCES biblioteca.uf(id),
    FOREIGN KEY (id_cidade) REFERENCES biblioteca.cidade(id),
    FOREIGN KEY (matricula_usuario) REFERENCES biblioteca.usuario(matricula),
    FOREIGN KEY (id_editora) REFERENCES biblioteca.editora(id)
);
