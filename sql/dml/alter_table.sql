-- ============================================================
-- DDL de ajuste — Gestão de Biblioteca
-- ============================================================
BEGIN;
ALTER TABLE livro
ADD COLUMN isbn isbn NOT NULL UNIQUE;
COMMENT ON COLUMN livro.isbn IS 'Número ISBN do livro';
COMMIT;