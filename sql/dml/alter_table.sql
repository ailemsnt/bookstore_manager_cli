-- ============================================================
-- DDL de ajuste — Gestão de Biblioteca
-- ============================================================
BEGIN;
ALTER TABLE livro
ADD COLUMN isbn isbn NOT NULL UNIQUE;
COMMENT ON COLUMN livro.isbn IS 'Número ISBN do livro';

ALTER TABLE autor
ADD COLUMN deletedAt TIMESTAMPTZ NULL;
COMMENT ON COLUMN autor.deletedAt IS 'Auditoria';

ALTER TABLE livro
ADD COLUMN deletedAt TIMESTAMPTZ NULL;
COMMENT ON COLUMN livro.deletedAt IS 'Auditoria';

ALTER TABLE cliente
ADD COLUMN deletedAt TIMESTAMPTZ NULL;
COMMENT ON COLUMN cliente.deletedAt IS 'Auditoria';
COMMIT;