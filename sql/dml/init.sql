-- ============================================================
-- DDL — Gestão de Biblioteca  (v1 — alinhado ao diagrama ER)
-- Compatível com: PostgreSQL 14+
-- ============================================================
-- Database: bookstore_manager

-- CREATE DATABASE bookstore_manager
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'C'
--     LC_CTYPE = 'C'
--     LOCALE_PROVIDER = 'libc'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;
------------------------------------------------------------------
--DROP TABLE IF EXISTS uf CASCADE;
CREATE TABLE IF NOT EXISTS uf(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(2) NOT NULL
);
COMMENT ON COLUMN uf.nome IS 'Nome da unidade federativa';
COMMENT ON COLUMN uf.sigla IS 'Sigla da unidade federativa';
------------------------------------------------------------------
--DROP TABLE IF EXISTS municipio CASCADE;
CREATE TABLE IF NOT EXISTS municipio(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(100) NOT NULL,
    uf_id INTEGER NOT NULL REFERENCES uf(id) ON DELETE CASCADE
);
COMMENT ON COLUMN municipio.nome IS 'Nome do município';
COMMENT ON COLUMN municipio.uf_id IS 'ID da unidade federativa';
-----------------------------------------------------------------
--DROP TABLE IF EXISTS perfil CASCADE;
CREATE TABLE IF NOT EXISTS perfil(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(30) NOT NULL UNIQUE
);
COMMENT ON COLUMN perfil.nome IS 'Nome do perfil';
-----------------------------------------------------------------
--DROP TABLE IF EXISTS usuario CASCADE;
CREATE TABLE IF NOT EXISTS usuario(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil_id INTEGER NOT NULL REFERENCES perfil(id) ON DELETE CASCADE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN usuario.login IS 'Login do usuário';
COMMENT ON COLUMN usuario.senha IS 'Senha do usuário';
COMMENT ON COLUMN usuario.perfil_id IS 'ID do perfil';
COMMENT ON COLUMN usuario.data_cadastro IS 'Data de cadastro';
-----------------------------------------------------------------
--DROP TABLE IF EXISTS autor CASCADE;
CREATE TABLE IF NOT EXISTS autor(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255) NOT NULL
);
COMMENT ON COLUMN autor.nome IS 'Nome do autor';
------------------------------------------------------------------
--DROP TABLE IF EXISTS livro CASCADE;
CREATE TABLE IF NOT EXISTS livro(
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo VARCHAR(255) NOT NULL,
    autor_id INTEGER NOT NULL REFERENCES autor(id) ON DELETE CASCADE,
    editora VARCHAR(100) NOT NULL,
    edicao VARCHAR(20) NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    disponivel INTEGER NOT NULL DEFAULT 1,
    data_cadastro TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN livro.titulo IS 'Título do livro';
COMMENT ON COLUMN livro.autor_id IS 'ID do autor do livro';
COMMENT ON COLUMN livro.editora IS 'Editora do livro';
COMMENT ON COLUMN livro.edicao IS 'Edição do livro';
COMMENT ON COLUMN livro.ano_publicacao IS 'Ano de publicação do livro';
COMMENT ON COLUMN livro.codigo IS 'Código interno do livro';
COMMENT ON COLUMN livro.disponivel IS 'Indica se o livro está disponível';
COMMENT ON COLUMN livro.data_cadastro IS 'Data de cadastro do livro';
------------------------------------------------------------------
--DROP TABLE IF EXISTS cliente CASCADE;
CREATE TABLE IF NOT EXISTS cliente(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    endereco VARCHAR(100) NOT NULL,
    cep CHAR(8) NOT NULL,
    numero VARCHAR(10) NOT NULL DEFAULT 'S/N',
    bairro VARCHAR(60) NOT NULL,
    municipio_id INTEGER NOT NULL REFERENCES municipio(id) ON DELETE CASCADE,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    data_cadastro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ativo INTEGER NOT NULL DEFAULT 1
);
COMMENT ON COLUMN cliente.nome IS 'Nome do cliente';
COMMENT ON COLUMN cliente.cpf IS 'CPF do cliente';
COMMENT ON COLUMN cliente.endereco IS 'Endereço do cliente';
COMMENT ON COLUMN cliente.cep IS 'CEP do cliente';
COMMENT ON COLUMN cliente.numero IS 'Número do endereço do cliente';
COMMENT ON COLUMN cliente.bairro IS 'Bairro do cliente';
COMMENT ON COLUMN cliente.municipio_id IS 'ID do município do cliente';
COMMENT ON COLUMN cliente.telefone IS 'Telefone do cliente';
COMMENT ON COLUMN cliente.email IS 'Email do cliente';
COMMENT ON COLUMN cliente.data_cadastro IS 'Data de cadastro';
COMMENT ON COLUMN cliente.ativo IS 'Indica se o cliente está ativo';
------------------------------------------------------------------
--DROP TABLE IF EXISTS emprestimo CASCADE;
CREATE TABLE IF NOT EXISTS emprestimo(
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    livro_id INTEGER NOT NULL REFERENCES livro(id) ON DELETE CASCADE,
    cliente_id INTEGER NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
    data_emprestimo TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_prevista_devolucao TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 days'),
    data_devolucao TIMESTAMPTZ,
    devolvido INTEGER NOT NULL DEFAULT 0,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
); 
COMMENT ON COLUMN emprestimo.livro_id IS 'ID do livro emprestado';
COMMENT ON COLUMN emprestimo.cliente_id IS 'ID do cliente que realizou o empréstimo';
COMMENT ON COLUMN emprestimo.data_emprestimo IS 'Data do empréstimo';
COMMENT ON COLUMN emprestimo.data_prevista_devolucao IS 'Data prevista para devolução';
COMMENT ON COLUMN emprestimo.data_devolucao IS 'Data de devolução do livro';
COMMENT ON COLUMN emprestimo.devolvido IS 'Indica se o livro foi devolvido (0 = não, 1 = sim)';
COMMENT ON COLUMN emprestimo.usuario_id IS 'ID do usuário que registrou o empréstimo';
------------------------------------------------------------------