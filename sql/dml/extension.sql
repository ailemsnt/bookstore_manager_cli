-- ============================================================
-- DDL de extensões — Gestão de Biblioteca
-- ============================================================

-- Comando para remover acentos de strings, útil para buscas insensíveis a acentos.
CREATE EXTENSION IF NOT EXISTS unaccent;

--Comando apara validar, armazenar e formatar códigos internacionais de livros (ISBN). 
-- adciona novos tipos de dados e funções, suporta multimídia (livros, revistas, músicas, código de barras)
CREATE EXTENSION IF NOT EXISTS isn;