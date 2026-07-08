import { Pool } from "pg";
import { Livro } from "../../../domain/livro";
import { LivroRepository } from "../livro.repository";
import { LargeNumberLike } from "node:crypto";

export class LivroPostgresRepository implements LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findBookByTitle(title: string): Promise<Livro | null> {
    const { rows } = await this.pool.query(
      ` SELECT l.*, a.nome AS autor_nome
          FROM livro l
          INNER JOIN autor a ON a.autor_id = l.autor.id
          WHERE lower(unaccent(l.titulo)) = lower(unaccent($1)) `,
      [title],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findBookById(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query(
        ` SELECT l.*, a.nome AS autor_nome
          FROM livro l
          INNER JOIN autor a ON a.autor_id = l.autor.id
          WHERE l.id = $1 `,
        [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAllBooks(): Promise<Livro[]> {
    const { rows } = await this.pool.query(
      ` SELECT l.*, a.nome AS autor_nome
        FROM livro l
        INNER JOIN autor a ON a.autor_id = l.autor.id 
        ORDER BY l.titulo `,
    );

    return rows;
  }

  async createBook(book: Omit<Livro, "id">): Promise<Livro> {
    const { rows: [row] } = await this.pool.query<Livro>(
      `INSERT INTO livro (titulo, autor_id, editora, edicao, ano_publicacao, codigo, disponivel, isbn) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING titulo, autor_id, editora, edicao, ano_publicacao, codigo, disponivel, isbn::text`,
      [book.titulo, book.autor_id, book.editora, book.edicao, book.ano_publicacao, book.codigo, book.disponivel, book.isbn]
    );
    return row;
  }

  async updateBook(id: number, titulo: string, autor_id: number, editora: string, edicao: string, ano_publicacao: number, disponivel: number ): Promise<Livro>{
    const { rows: [row], } = await this.pool.query<Livro>(
          `UPDATE livro SET titulo = $1, autor_id = $2, editora = $3, edicao = $4, ano_publicacao = $5, disponivel = $6
           WHERE id = $7 RETURNING *`,
          [titulo, autor_id, editora, edicao, ano_publicacao, disponivel, id],
        );
    
        return row;
  }

  async deleteBook(id: number): Promise<void> {
    const result = await this.pool.query("DELETE FROM livro WHERE id = $1", [id]);
  }

}