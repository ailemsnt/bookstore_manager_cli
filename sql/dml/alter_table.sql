-- ============================================================
-- DDL de ajuste — Gestão de Biblioteca
-- ============================================================
BEGIN;
ALTER TABLE livro
ADD COLUMN isbn isbn NOT NULL;
COMMENT ON COLUMN livro.isbn IS 'Número ISBN do livro';

ALTER TABLE autor
ADD COLUMN deleted_at TIMESTAMPTZ NULL;
COMMENT ON COLUMN autor.deleted_at IS 'Auditoria';

ALTER TABLE livro
ADD COLUMN deleted_at TIMESTAMPTZ NULL;
COMMENT ON COLUMN livro.deleted_at IS 'Auditoria';

ALTER TABLE cliente
ADD COLUMN deleted_at TIMESTAMPTZ NULL;
COMMENT ON COLUMN cliente.deleted_at IS 'Auditoria';

ALTER TABLE emprestimo
ADD COLUMN canceled_at TIMESTAMPTZ NULL;
COMMENT ON COLUMN emprestimo.canceled_at IS 'Auditoria';

ALTER TABLE livro
ADD CONSTRAINT uq_livro_codigo_isbn UNIQUE (codigo, isbn);
COMMIT;