
CREATE TABLE categoria(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Autor
CREATE TABLE autor(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    biografia TEXT,
    nacionalidade VARCHAR(10) NOT NULL,
    foto VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Editora
CREATE TABLE editora (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(15) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Livro
CREATE TABLE livro (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    foto VARCHAR(100),
    sinopse TEXT,
    enredo TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Entrada
CREATE TABLE entrada (
    id SERIAL PRIMARY KEY,
    status CHAR CHECK (status IN ('A','F','C')) DEFAULT 'A',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP DEFAULT NULL
);
-- Exemplar
CREATE TABLE exemplar (
    id SERIAL PRIMARY KEY,
    id_livro INT NOT NULL,  -- Relaciona o exemplar com o livro correspondente
    id_estado_livro INT NOT NULL,  -- Relaciona o exemplar com o estado correspondente
    id_entrada INT NOT NULL,
    edicao VARCHAR(40),
    data_publicacao DATE,
    data_aquisicao TIMESTAMP NOT NULL,  -- Data de aquisição do exemplar
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de cadastro do exemplar
    status CHAR CHECK (status IN ('D', 'E', 'M', 'P', 'V', 'I')) DEFAULT 'D',  -- Status: disponível, emprestado, em manutenção, perdido, vendido, inutilizado
    FOREIGN KEY (id_livro) REFERENCES livro(id),  -- Relaciona o exemplar com o livro
    FOREIGN KEY (id_estado_livro) REFERENCES estado_livro(id),  -- Relaciona o exemplar com o estado do livro
    FOREIGN KEY (id_entrada) REFERENCES entrada(id)
);