--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_emprestimo_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_emprestimo_status AS ENUM (
    'Emprestado',
    'Devolvido'
);


ALTER TYPE public.enum_emprestimo_status OWNER TO postgres;

--
-- Name: enum_exemplar_condicao_fisica; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_exemplar_condicao_fisica AS ENUM (
    'Novo',
    'Usado',
    'Danificado',
    'Recondicionado'
);


ALTER TYPE public.enum_exemplar_condicao_fisica OWNER TO postgres;

--
-- Name: enum_exemplar_situacao; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_exemplar_situacao AS ENUM (
    'Disponível',
    'Emprestado',
    'Manutenção',
    'Perdido',
    'Vendido',
    'Inutilizado'
);


ALTER TYPE public.enum_exemplar_situacao OWNER TO postgres;

--
-- Name: enum_multa_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_multa_status AS ENUM (
    'A',
    'C',
    'R'
);


ALTER TYPE public.enum_multa_status OWNER TO postgres;

--
-- Name: enum_reserva_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reserva_status AS ENUM (
    'Aberta',
    'Cancelada',
    'Finalizada'
);


ALTER TYPE public.enum_reserva_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: autor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autor (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    data_nascimento date,
    biografia text,
    nacionalidade character varying(100) NOT NULL,
    foto character varying(100)
);


ALTER TABLE public.autor OWNER TO postgres;

--
-- Name: autor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.autor_id_seq OWNER TO postgres;

--
-- Name: autor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autor_id_seq OWNED BY public.autor.id;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao character varying(255) NOT NULL
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_seq OWNER TO postgres;

--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: cidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cidade (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    id_uf integer NOT NULL
);


ALTER TABLE public.cidade OWNER TO postgres;

--
-- Name: cidade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cidade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cidade_id_seq OWNER TO postgres;

--
-- Name: cidade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cidade_id_seq OWNED BY public.cidade.id;


--
-- Name: editora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.editora (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    cnpj character varying(15) NOT NULL
);


ALTER TABLE public.editora OWNER TO postgres;

--
-- Name: editora_endereco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.editora_endereco (
    id integer NOT NULL,
    logradouro character varying(255) NOT NULL,
    numero character varying(255) NOT NULL,
    bairro character varying(255) NOT NULL,
    cep character varying(255) NOT NULL,
    id_editora integer NOT NULL,
    id_cidade integer NOT NULL
);


ALTER TABLE public.editora_endereco OWNER TO postgres;

--
-- Name: editora_endereco_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.editora_endereco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.editora_endereco_id_seq OWNER TO postgres;

--
-- Name: editora_endereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.editora_endereco_id_seq OWNED BY public.editora_endereco.id;


--
-- Name: editora_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.editora_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.editora_id_seq OWNER TO postgres;

--
-- Name: editora_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.editora_id_seq OWNED BY public.editora.id;


--
-- Name: emprestimo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emprestimo (
    id integer NOT NULL,
    data_emprestimo date NOT NULL,
    data_prevista_devolucao date NOT NULL,
    data_devolucao date,
    observacoes text,
    id_usuario integer NOT NULL,
    id_reserva integer,
    id_exemplar integer NOT NULL,
    status public.enum_emprestimo_status DEFAULT 'Emprestado'::public.enum_emprestimo_status,
    quantidade_renovacoes integer DEFAULT 0
);


ALTER TABLE public.emprestimo OWNER TO postgres;

--
-- Name: emprestimo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emprestimo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emprestimo_id_seq OWNER TO postgres;

--
-- Name: emprestimo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emprestimo_id_seq OWNED BY public.emprestimo.id;


--
-- Name: endereco_editora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endereco_editora (
    id integer NOT NULL,
    logradouro character varying(255) NOT NULL,
    numero character varying(255) NOT NULL,
    bairro character varying(255) NOT NULL,
    cep character varying(255) NOT NULL,
    id_editora integer NOT NULL,
    id_cidade integer NOT NULL
);


ALTER TABLE public.endereco_editora OWNER TO postgres;

--
-- Name: endereco_editora_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.endereco_editora_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.endereco_editora_id_seq OWNER TO postgres;

--
-- Name: endereco_editora_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.endereco_editora_id_seq OWNED BY public.endereco_editora.id;


--
-- Name: endereco_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endereco_usuario (
    id integer NOT NULL,
    logradouro character varying(255) NOT NULL,
    numero character varying(255) NOT NULL,
    bairro character varying(255) NOT NULL,
    cep character varying(255) NOT NULL,
    id_usuario integer NOT NULL,
    id_cidade integer NOT NULL
);


ALTER TABLE public.endereco_usuario OWNER TO postgres;

--
-- Name: endereco_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.endereco_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.endereco_usuario_id_seq OWNER TO postgres;

--
-- Name: endereco_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.endereco_usuario_id_seq OWNED BY public.endereco_usuario.id;


--
-- Name: exemplar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exemplar (
    id integer NOT NULL,
    id_editora integer NOT NULL,
    id_livro integer NOT NULL,
    condicao_fisica public.enum_exemplar_condicao_fisica DEFAULT 'Novo'::public.enum_exemplar_condicao_fisica NOT NULL,
    edicao character varying(255) NOT NULL,
    ano integer NOT NULL,
    data_aquisicao date,
    situacao public.enum_exemplar_situacao DEFAULT 'Disponível'::public.enum_exemplar_situacao NOT NULL,
    observacoes text
);


ALTER TABLE public.exemplar OWNER TO postgres;

--
-- Name: exemplar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exemplar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exemplar_id_seq OWNER TO postgres;

--
-- Name: exemplar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exemplar_id_seq OWNED BY public.exemplar.id;


--
-- Name: funcionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionario (
    id integer NOT NULL,
    ativo boolean DEFAULT true,
    nome character varying(100) NOT NULL,
    cpf character varying(100),
    email character varying(100),
    data_nascimento timestamp with time zone,
    senha character varying(100),
    foto character varying(100),
    salario numeric(15,2),
    data_contratacao date,
    data_demissao date,
    token text
);


ALTER TABLE public.funcionario OWNER TO postgres;

--
-- Name: funcionario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.funcionario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funcionario_id_seq OWNER TO postgres;

--
-- Name: funcionario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.funcionario_id_seq OWNED BY public.funcionario.id;


--
-- Name: livro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livro (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL,
    foto text,
    sinopse text,
    enredo text,
    id_categoria integer NOT NULL,
    ativo boolean DEFAULT true
);


ALTER TABLE public.livro OWNER TO postgres;

--
-- Name: livro_autor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livro_autor (
    id integer NOT NULL,
    id_livro integer NOT NULL,
    id_autor integer NOT NULL
);


ALTER TABLE public.livro_autor OWNER TO postgres;

--
-- Name: livro_autor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.livro_autor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livro_autor_id_seq OWNER TO postgres;

--
-- Name: livro_autor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.livro_autor_id_seq OWNED BY public.livro_autor.id;


--
-- Name: livro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.livro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livro_id_seq OWNER TO postgres;

--
-- Name: livro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.livro_id_seq OWNED BY public.livro.id;


--
-- Name: multa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.multa (
    id integer NOT NULL,
    valor numeric(15,2) NOT NULL,
    id_usuario integer NOT NULL,
    id_emprestimo integer,
    data_vencimento date NOT NULL,
    status public.enum_multa_status DEFAULT 'A'::public.enum_multa_status,
    data_pagamento date
);


ALTER TABLE public.multa OWNER TO postgres;

--
-- Name: multa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.multa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.multa_id_seq OWNER TO postgres;

--
-- Name: multa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.multa_id_seq OWNED BY public.multa.id;


--
-- Name: reserva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reserva (
    id integer NOT NULL,
    observacoes text,
    id_exemplar integer NOT NULL,
    status public.enum_reserva_status DEFAULT 'Aberta'::public.enum_reserva_status,
    id_usuario integer NOT NULL,
    data_reserva date NOT NULL,
    data_prevista_devolucao date
);


ALTER TABLE public.reserva OWNER TO postgres;

--
-- Name: reserva_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reserva_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reserva_id_seq OWNER TO postgres;

--
-- Name: reserva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reserva_id_seq OWNED BY public.reserva.id;


--
-- Name: telefone_editora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefone_editora (
    id integer NOT NULL,
    ddd character varying(100) NOT NULL,
    numero character varying(100) NOT NULL,
    id_editora integer NOT NULL
);


ALTER TABLE public.telefone_editora OWNER TO postgres;

--
-- Name: telefone_editora_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefone_editora_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefone_editora_id_seq OWNER TO postgres;

--
-- Name: telefone_editora_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefone_editora_id_seq OWNED BY public.telefone_editora.id;


--
-- Name: telefone_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefone_usuario (
    id integer NOT NULL,
    ddd character varying(100) NOT NULL,
    numero character varying(100) NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE public.telefone_usuario OWNER TO postgres;

--
-- Name: telefone_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefone_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefone_usuario_id_seq OWNER TO postgres;

--
-- Name: telefone_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefone_usuario_id_seq OWNED BY public.telefone_usuario.id;


--
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id integer NOT NULL,
    token character varying(100) NOT NULL,
    data_expiracao date NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE public.token OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.token_id_seq OWNER TO postgres;

--
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;


--
-- Name: uf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uf (
    id integer NOT NULL,
    sigla character varying(2) NOT NULL,
    nome character varying(100) NOT NULL
);


ALTER TABLE public.uf OWNER TO postgres;

--
-- Name: uf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.uf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.uf_id_seq OWNER TO postgres;

--
-- Name: uf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.uf_id_seq OWNED BY public.uf.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    ativo boolean DEFAULT true,
    nome character varying(100) NOT NULL,
    cpf character varying(100),
    email character varying(100) NOT NULL,
    data_nascimento timestamp with time zone,
    senha character varying(100) NOT NULL,
    foto character varying(100),
    token text
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: usuario_telefone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_telefone (
    id integer NOT NULL,
    ddd character varying(100) NOT NULL,
    numero character varying(100) NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE public.usuario_telefone OWNER TO postgres;

--
-- Name: usuario_telefone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_telefone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_telefone_id_seq OWNER TO postgres;

--
-- Name: usuario_telefone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_telefone_id_seq OWNED BY public.usuario_telefone.id;


--
-- Name: autor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autor ALTER COLUMN id SET DEFAULT nextval('public.autor_id_seq'::regclass);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: cidade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cidade ALTER COLUMN id SET DEFAULT nextval('public.cidade_id_seq'::regclass);


--
-- Name: editora id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora ALTER COLUMN id SET DEFAULT nextval('public.editora_id_seq'::regclass);


--
-- Name: editora_endereco id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora_endereco ALTER COLUMN id SET DEFAULT nextval('public.editora_endereco_id_seq'::regclass);


--
-- Name: emprestimo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimo ALTER COLUMN id SET DEFAULT nextval('public.emprestimo_id_seq'::regclass);


--
-- Name: endereco_editora id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_editora ALTER COLUMN id SET DEFAULT nextval('public.endereco_editora_id_seq'::regclass);


--
-- Name: endereco_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_usuario ALTER COLUMN id SET DEFAULT nextval('public.endereco_usuario_id_seq'::regclass);


--
-- Name: exemplar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplar ALTER COLUMN id SET DEFAULT nextval('public.exemplar_id_seq'::regclass);


--
-- Name: funcionario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario ALTER COLUMN id SET DEFAULT nextval('public.funcionario_id_seq'::regclass);


--
-- Name: livro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro ALTER COLUMN id SET DEFAULT nextval('public.livro_id_seq'::regclass);


--
-- Name: livro_autor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro_autor ALTER COLUMN id SET DEFAULT nextval('public.livro_autor_id_seq'::regclass);


--
-- Name: multa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multa ALTER COLUMN id SET DEFAULT nextval('public.multa_id_seq'::regclass);


--
-- Name: reserva id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserva ALTER COLUMN id SET DEFAULT nextval('public.reserva_id_seq'::regclass);


--
-- Name: telefone_editora id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_editora ALTER COLUMN id SET DEFAULT nextval('public.telefone_editora_id_seq'::regclass);


--
-- Name: telefone_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_usuario ALTER COLUMN id SET DEFAULT nextval('public.telefone_usuario_id_seq'::regclass);


--
-- Name: token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- Name: uf id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uf ALTER COLUMN id SET DEFAULT nextval('public.uf_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: usuario_telefone id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_telefone ALTER COLUMN id SET DEFAULT nextval('public.usuario_telefone_id_seq'::regclass);


--
-- Data for Name: autor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.autor (id, nome, data_nascimento, biografia, nacionalidade, foto) FROM stdin;
1	Jostein Gaarder	1952-08-08	Escritor norueguês conhecido por obras que exploram filosofia de forma acessível, como 'O Mundo de Sofia'.	Norueguês	\N
3	J.K. Rowling	1965-07-31	Autora britânica famosa pela série Harry Potter.	Britânica	https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg
4	George Orwell	1903-06-25	Autor de 1984 e A Revolução dos Bichos, crítico do totalitarismo.	Britânica	https://upload.wikimedia.org/wikipedia/commons/c/c3/George_Orwell_press_photo.jpg
5	Machado de Assis	1839-06-21	Fundador da Academia Brasileira de Letras e autor de Dom Casmurro.	Brasileira	https://upload.wikimedia.org/wikipedia/commons/4/44/Joaquim_Maria_Machado_de_Assis.jpg
6	Jane Austen	1775-12-16	Autora inglesa de romances como Orgulho e Preconceito.	Britânica	https://upload.wikimedia.org/wikipedia/commons/c/cd/CassandraAusten-JaneAusten(c.1810)_hires.jpg
7	Gabriel García Márquez	1927-03-06	Autor colombiano, conhecido por Cem Anos de Solidão.	Colombiana	https://upload.wikimedia.org/wikipedia/commons/b/b9/Gabriel_Garcia_Marquez.jpg
8	Franz Kafka	1883-07-03	Escritor tcheco de língua alemã, autor de A Metamorfose.	Austro-húngara	https://upload.wikimedia.org/wikipedia/commons/4/4c/Kafka_portrait.jpg
9	Clarice Lispector	1920-12-10	Uma das mais importantes escritoras brasileiras do século XX.	Brasileira	https://upload.wikimedia.org/wikipedia/commons/7/76/Clarice_Lispector.jpg
10	Ernest Hemingway	1899-07-21	Autor americano conhecido por O Velho e o Mar.	Americana	https://upload.wikimedia.org/wikipedia/commons/0/0c/ErnestHemingway.jpg
11	Leo Tolstoy	1828-09-09	Autor russo de Guerra e Paz e Anna Kariênina.	Russa	https://upload.wikimedia.org/wikipedia/commons/7/70/Lev_Nikolayevich_Tolstoy.jpg
12	Virginia Woolf	1882-01-25	Escritora britânica conhecida por Mrs. Dalloway e Ao Farol.	Britânica	https://upload.wikimedia.org/wikipedia/commons/0/00/Virginia_Woolf_1927.jpg
\.


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id, nome, descricao) FROM stdin;
1	Filosofia	Abrange livros que exploram questões fundamentais sobre existência, conhecimento, moralidade e a natureza da realidade.
6	Terror	Terror mesmo ui ui
\.


--
-- Data for Name: cidade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cidade (id, nome, id_uf) FROM stdin;
\.


--
-- Data for Name: editora; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.editora (id, nome, cnpj) FROM stdin;
1	Editora Schwarcz S.A. (Companhia das Letras)	55789390000899
\.


--
-- Data for Name: editora_endereco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.editora_endereco (id, logradouro, numero, bairro, cep, id_editora, id_cidade) FROM stdin;
\.


--
-- Data for Name: emprestimo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emprestimo (id, data_emprestimo, data_prevista_devolucao, data_devolucao, observacoes, id_usuario, id_reserva, id_exemplar, status, quantidade_renovacoes) FROM stdin;
\.


--
-- Data for Name: endereco_editora; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.endereco_editora (id, logradouro, numero, bairro, cep, id_editora, id_cidade) FROM stdin;
\.


--
-- Data for Name: endereco_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.endereco_usuario (id, logradouro, numero, bairro, cep, id_usuario, id_cidade) FROM stdin;
\.


--
-- Data for Name: exemplar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exemplar (id, id_editora, id_livro, condicao_fisica, edicao, ano, data_aquisicao, situacao, observacoes) FROM stdin;
23	1	1	Novo	1	1991	2023-04-25	Disponível	Exemplar em ótimo estado, capa dura.
24	1	1	Novo	1	1991	2023-04-25	Disponível	Exemplar em ótimo estado, capa dura.
25	1	1	Novo	1	1991	2023-04-25	Disponível	Exemplar em ótimo estado, capa dura.
26	1	1	Novo	1	1991	2023-04-25	Disponível	Exemplar em ótimo estado, capa dura.
27	1	1	Novo	1	1991	2023-04-25	Disponível	Exemplar em ótimo estado, capa dura.
\.


--
-- Data for Name: funcionario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionario (id, ativo, nome, cpf, email, data_nascimento, senha, foto, salario, data_contratacao, data_demissao, token) FROM stdin;
1	t	Guilherme Smith	13353707908	guilhermessmith2014@gmail.com	2003-02-28 21:00:00-03	$2b$10$OosfM/vrTlhKPGjOq/kiH.z0tMbO.xq8ucLrJLEzihoOYrNrDYMA6	\N	\N	\N	\N	346260d020f915ff8a58e3a6923818cea89cd63990a7bd0b6864742172ee2098468a98046c64a62bf6d29db19329462036981a36f33fe83183ffeb94267bec04
2	t	Rafaeli	78504639002	rafaeli.pinheiro@gmail.com	\N	$2b$10$6JijO03384yUd47FI3tT1unUh/lLVJjlxXovfbXIhkvLIedhSwphq	\N	\N	\N	\N	\N
3	t	Teste	44930990033	guilherme.rodrigues@ixcsoft.com.br	\N	$2b$10$TjIEnU7GXdEjhlpBA69UTOnpJHNjhoQmwuuMdjSPciGOGEVmB.8qq	\N	\N	\N	\N	\N
4	t	teste	\N	guilherme.rodri22gues@ixcsoft.com.br	\N	$2b$10$mrvpMPmfKbtPL6bisu1Pce0fzjoRliN3wUrmzMtvIIDt38gb2FCLK	\N	\N	\N	\N	\N
\.


--
-- Data for Name: livro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livro (id, titulo, foto, sinopse, enredo, id_categoria, ativo) FROM stdin;
1	O Mundo de Sofia	https://example.com/imagens/o-mundo-de-sofia.jpg	Uma introdução à história da filosofia através de uma narrativa envolvente.	Sofia, uma jovem de 14 anos, comexça a receber cartas misteriosas que a levam a explorar os grandes filósofos da história. Ao longo da jornada, ela descobre que sua própria existência está conectada a um mistério ainda maior.	1	t
2	O Mundo de Sofia	https://cdl-static.s3-sa-east-1.amazonaws.com/covers/gg/9788555343872/o-mundo-de-sofia-em-quadrinhos-vol-2.jpg	Uma introdução à história da filosofia através de uma narrativa envolvente.	Sofia, uma jovem de 14 anos, começa a receber cartas misteriosas que a levam a explorar os grandes filósofos da história. Ao longo da jornada, ela descobre que sua própria existência está conectada a um mistério ainda maior.	1	t
\.


--
-- Data for Name: livro_autor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livro_autor (id, id_livro, id_autor) FROM stdin;
2	1	1
3	2	1
4	2	5
6	2	3
\.


--
-- Data for Name: multa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.multa (id, valor, id_usuario, id_emprestimo, data_vencimento, status, data_pagamento) FROM stdin;
4	10.00	1	\N	2025-05-03	A	\N
5	10.00	1	\N	2025-05-03	A	\N
6	10.00	1	\N	2025-05-03	A	\N
7	10.00	1	\N	2025-05-03	A	\N
8	10.00	1	\N	2025-05-03	A	\N
9	10.00	1	\N	2025-05-03	A	\N
10	10.00	1	\N	2025-05-03	A	\N
\.


--
-- Data for Name: reserva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reserva (id, observacoes, id_exemplar, status, id_usuario, data_reserva, data_prevista_devolucao) FROM stdin;
\.


--
-- Data for Name: telefone_editora; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telefone_editora (id, ddd, numero, id_editora) FROM stdin;
\.


--
-- Data for Name: telefone_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telefone_usuario (id, ddd, numero, id_usuario) FROM stdin;
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, token, data_expiracao, id_usuario) FROM stdin;
\.


--
-- Data for Name: uf; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uf (id, sigla, nome) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, ativo, nome, cpf, email, data_nascimento, senha, foto, token) FROM stdin;
1	t	Guilherme Smith	\N	guilhermessmith2014@gmail.com	\N	$2b$10$DuMZx0vMbitRF8JUAJf10.6YXdcCRrgqKGWlE1S.aSDSV0rq6UArG	\N	b9eba8db6879a8978c50dc5be0d461508709df34dcd9855485db35c21f03ea0c
2	t	Rafaeli Pinheiro	\N	rafaeli.pinheiro@gmail.com	\N	$2b$10$Rwk1o4L0DSkP4nZaCYo5tuJoFhNDZvQa0hBHXfHb.hEE4S3OiHTFS	\N	\N
\.


--
-- Data for Name: usuario_telefone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_telefone (id, ddd, numero, id_usuario) FROM stdin;
\.


--
-- Name: autor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.autor_id_seq', 12, true);


--
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 6, true);


--
-- Name: cidade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cidade_id_seq', 1, false);


--
-- Name: editora_endereco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.editora_endereco_id_seq', 1, false);


--
-- Name: editora_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.editora_id_seq', 3, true);


--
-- Name: emprestimo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emprestimo_id_seq', 7, true);


--
-- Name: endereco_editora_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.endereco_editora_id_seq', 1, false);


--
-- Name: endereco_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.endereco_usuario_id_seq', 1, false);


--
-- Name: exemplar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exemplar_id_seq', 27, true);


--
-- Name: funcionario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.funcionario_id_seq', 4, true);


--
-- Name: livro_autor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.livro_autor_id_seq', 6, true);


--
-- Name: livro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.livro_id_seq', 21, true);


--
-- Name: multa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.multa_id_seq', 10, true);


--
-- Name: reserva_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reserva_id_seq', 3, true);


--
-- Name: telefone_editora_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telefone_editora_id_seq', 1, false);


--
-- Name: telefone_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telefone_usuario_id_seq', 1, false);


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_id_seq', 1, false);


--
-- Name: uf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.uf_id_seq', 1, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 2, true);


--
-- Name: usuario_telefone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_telefone_id_seq', 1, false);


--
-- Name: autor autor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autor
    ADD CONSTRAINT autor_pkey PRIMARY KEY (id);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: cidade cidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cidade
    ADD CONSTRAINT cidade_pkey PRIMARY KEY (id);


--
-- Name: editora editora_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key1 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key10 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key11 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key12 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key13 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key14 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key2 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key3 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key4 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key5 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key6 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key7 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key8 UNIQUE (cnpj);


--
-- Name: editora editora_cnpj_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_cnpj_key9 UNIQUE (cnpj);


--
-- Name: editora_endereco editora_endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora_endereco
    ADD CONSTRAINT editora_endereco_pkey PRIMARY KEY (id);


--
-- Name: editora editora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora
    ADD CONSTRAINT editora_pkey PRIMARY KEY (id);


--
-- Name: emprestimo emprestimo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimo
    ADD CONSTRAINT emprestimo_pkey PRIMARY KEY (id);


--
-- Name: endereco_editora endereco_editora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_editora
    ADD CONSTRAINT endereco_editora_pkey PRIMARY KEY (id);


--
-- Name: endereco_usuario endereco_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_usuario
    ADD CONSTRAINT endereco_usuario_pkey PRIMARY KEY (id);


--
-- Name: exemplar exemplar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplar
    ADD CONSTRAINT exemplar_pkey PRIMARY KEY (id);


--
-- Name: funcionario funcionario_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key UNIQUE (cpf);


--
-- Name: funcionario funcionario_cpf_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key1 UNIQUE (cpf);


--
-- Name: funcionario funcionario_cpf_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key2 UNIQUE (cpf);


--
-- Name: funcionario funcionario_cpf_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key3 UNIQUE (cpf);


--
-- Name: funcionario funcionario_cpf_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key4 UNIQUE (cpf);


--
-- Name: funcionario funcionario_cpf_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key5 UNIQUE (cpf);


--
-- Name: funcionario funcionario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key UNIQUE (email);


--
-- Name: funcionario funcionario_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key1 UNIQUE (email);


--
-- Name: funcionario funcionario_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key2 UNIQUE (email);


--
-- Name: funcionario funcionario_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key3 UNIQUE (email);


--
-- Name: funcionario funcionario_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key4 UNIQUE (email);


--
-- Name: funcionario funcionario_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key5 UNIQUE (email);


--
-- Name: funcionario funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pkey PRIMARY KEY (id);


--
-- Name: livro_autor livro_autor_id_livro_id_autor_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro_autor
    ADD CONSTRAINT livro_autor_id_livro_id_autor_key UNIQUE (id_livro, id_autor);


--
-- Name: livro_autor livro_autor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro_autor
    ADD CONSTRAINT livro_autor_pkey PRIMARY KEY (id);


--
-- Name: livro livro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro
    ADD CONSTRAINT livro_pkey PRIMARY KEY (id);


--
-- Name: multa multa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multa
    ADD CONSTRAINT multa_pkey PRIMARY KEY (id);


--
-- Name: reserva reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_pkey PRIMARY KEY (id);


--
-- Name: telefone_editora telefone_editora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_editora
    ADD CONSTRAINT telefone_editora_pkey PRIMARY KEY (id);


--
-- Name: telefone_usuario telefone_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_usuario
    ADD CONSTRAINT telefone_usuario_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token token_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key UNIQUE (token);


--
-- Name: token token_token_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key1 UNIQUE (token);


--
-- Name: token token_token_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key2 UNIQUE (token);


--
-- Name: token token_token_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key3 UNIQUE (token);


--
-- Name: token token_token_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key4 UNIQUE (token);


--
-- Name: token token_token_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key5 UNIQUE (token);


--
-- Name: token token_token_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key6 UNIQUE (token);


--
-- Name: token token_token_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key7 UNIQUE (token);


--
-- Name: uf uf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uf
    ADD CONSTRAINT uf_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key1 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key10 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key11 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key12 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key13 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key2 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key3 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key4 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key5 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key6 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key7 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key8 UNIQUE (cpf);


--
-- Name: usuario usuario_cpf_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cpf_key9 UNIQUE (cpf);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key1 UNIQUE (email);


--
-- Name: usuario usuario_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key10 UNIQUE (email);


--
-- Name: usuario usuario_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key11 UNIQUE (email);


--
-- Name: usuario usuario_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key12 UNIQUE (email);


--
-- Name: usuario usuario_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key13 UNIQUE (email);


--
-- Name: usuario usuario_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key2 UNIQUE (email);


--
-- Name: usuario usuario_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key3 UNIQUE (email);


--
-- Name: usuario usuario_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key4 UNIQUE (email);


--
-- Name: usuario usuario_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key5 UNIQUE (email);


--
-- Name: usuario usuario_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key6 UNIQUE (email);


--
-- Name: usuario usuario_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key7 UNIQUE (email);


--
-- Name: usuario usuario_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key8 UNIQUE (email);


--
-- Name: usuario usuario_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key9 UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: usuario_telefone usuario_telefone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_telefone
    ADD CONSTRAINT usuario_telefone_pkey PRIMARY KEY (id);


--
-- Name: cidade cidade_id_uf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cidade
    ADD CONSTRAINT cidade_id_uf_fkey FOREIGN KEY (id_uf) REFERENCES public.uf(id) ON UPDATE CASCADE;


--
-- Name: editora_endereco editora_endereco_id_cidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora_endereco
    ADD CONSTRAINT editora_endereco_id_cidade_fkey FOREIGN KEY (id_cidade) REFERENCES public.cidade(id) ON UPDATE CASCADE;


--
-- Name: editora_endereco editora_endereco_id_editora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editora_endereco
    ADD CONSTRAINT editora_endereco_id_editora_fkey FOREIGN KEY (id_editora) REFERENCES public.editora(id) ON UPDATE CASCADE;


--
-- Name: emprestimo emprestimo_id_exemplar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimo
    ADD CONSTRAINT emprestimo_id_exemplar_fkey FOREIGN KEY (id_exemplar) REFERENCES public.exemplar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: emprestimo emprestimo_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimo
    ADD CONSTRAINT emprestimo_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: endereco_editora endereco_editora_id_cidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_editora
    ADD CONSTRAINT endereco_editora_id_cidade_fkey FOREIGN KEY (id_cidade) REFERENCES public.cidade(id) ON UPDATE CASCADE;


--
-- Name: endereco_editora endereco_editora_id_editora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_editora
    ADD CONSTRAINT endereco_editora_id_editora_fkey FOREIGN KEY (id_editora) REFERENCES public.editora(id) ON UPDATE CASCADE;


--
-- Name: endereco_usuario endereco_usuario_id_cidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_usuario
    ADD CONSTRAINT endereco_usuario_id_cidade_fkey FOREIGN KEY (id_cidade) REFERENCES public.cidade(id) ON UPDATE CASCADE;


--
-- Name: endereco_usuario endereco_usuario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco_usuario
    ADD CONSTRAINT endereco_usuario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE;


--
-- Name: exemplar exemplar_id_editora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplar
    ADD CONSTRAINT exemplar_id_editora_fkey FOREIGN KEY (id_editora) REFERENCES public.editora(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exemplar exemplar_id_livro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplar
    ADD CONSTRAINT exemplar_id_livro_fkey FOREIGN KEY (id_livro) REFERENCES public.livro(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: livro_autor livro_autor_id_autor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro_autor
    ADD CONSTRAINT livro_autor_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES public.autor(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: livro_autor livro_autor_id_livro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro_autor
    ADD CONSTRAINT livro_autor_id_livro_fkey FOREIGN KEY (id_livro) REFERENCES public.livro(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: livro livro_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livro
    ADD CONSTRAINT livro_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id) ON UPDATE CASCADE;


--
-- Name: multa multa_id_emprestimo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multa
    ADD CONSTRAINT multa_id_emprestimo_fkey FOREIGN KEY (id_emprestimo) REFERENCES public.emprestimo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: multa multa_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multa
    ADD CONSTRAINT multa_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reserva reserva_id_exemplar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT reserva_id_exemplar_fkey FOREIGN KEY (id_exemplar) REFERENCES public.exemplar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telefone_editora telefone_editora_id_editora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_editora
    ADD CONSTRAINT telefone_editora_id_editora_fkey FOREIGN KEY (id_editora) REFERENCES public.editora(id) ON UPDATE CASCADE;


--
-- Name: telefone_usuario telefone_usuario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefone_usuario
    ADD CONSTRAINT telefone_usuario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE;


--
-- Name: token token_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE;


--
-- Name: usuario_telefone usuario_telefone_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_telefone
    ADD CONSTRAINT usuario_telefone_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

