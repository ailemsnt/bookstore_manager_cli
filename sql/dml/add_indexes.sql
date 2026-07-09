-- ============================================================
-- DDL de índices — Gestão de Biblioteca
-- ============================================================
CREATE INDEX idx_municipio_uf_id ON municipio(uf_id);
CREATE INDEX idx_usuario_perfil_id ON usuario(perfil_id);
CREATE INDEX idx_livro_autor_id ON livro(autor_id);
CREATE INDEX idx_cliente_municipio_id ON cliente(municipio_id);
CREATE INDEX idx_emprestimo_livro_id ON emprestimo(livro_id);
CREATE INDEX idx_emprestimo_cliente_id ON emprestimo(cliente_id);
CREATE INDEX idx_emprestimo_usuario_id ON emprestimo(usuario_id);