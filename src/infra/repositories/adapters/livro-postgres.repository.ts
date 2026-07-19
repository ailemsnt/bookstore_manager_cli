import { Livro, LivroCreate } from './../../../domain/livro';
import { Pool } from 'pg';
import { LivroRepository } from '../livro.repository';
import { BookListDto } from '../../../view/dto/book-list.dto';

export class LivroPostgresRepository implements LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findBookByTitle(title: string): Promise<BookListDto[]> {
    const { rows } = await this.pool.query(
      ` SELECT l.*, la.*, a.nome as nome_autor
          FROM livro l
          INNER JOIN livro_autor la ON la.livro_id = l.id
          INNER JOIN autor a ON a.id = la.autor_id
          WHERE (unaccent(l.titulo)) ilike (unaccent($1)) AND (l.deleted_at is null AND a.deleted_at is null)
          ORDER BY l.titulo ASC`,
      [`${title}%`],
    );

    if (rows.length === 0) {
      return [];
    }

    return rows;
  }

  async findBookByInternalCodeIsbn(
    internalCode: string,
    isbn: number,
  ): Promise<Livro | null> {
    const result = await this.pool.query(
      `SELECT l.*, la.*, a.nome as nome_autor
          FROM livro l
          INNER JOIN livro_autor la ON la.livro_id = l.id
          INNER JOIN autor a ON a.id = la.autor_id
          WHERE l.codigo = $1 AND l.isbn = $2 AND (l.deleted_at is null AND a.deleted_at is null)`,
      [internalCode, isbn],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const books = result.rows.reduce((acc, row) => {
      const book = acc.get(row.livro_id);

      if (!book) {
        acc.set(row.livro_id, {
          id: row.livro_id,
          titulo: row.titulo,
          editora: row.editora,
          edicao: row.edicao,
          ano_publicacao: row.ano_publicacao,
          codigo: row.codigo,
          baixado: row.baixado,
          isbn: row.isbn,
          autores: [
            {
              id: row.autor_id,
              nome: row.nome_autor,
            },
          ],
        });
        return acc;
      }

      book.autores.push({
        id: row.autor_id,
        nome: row.nome_autor,
      });
      return acc;
    }, new Map<number, Livro>());

    return books.values().next().value ?? null;
  }

  async findBookById(id: number): Promise<Livro | null> {
    const result = await this.pool.query(
      `SELECT l.*, la.*, a.nome as nome_autor
          FROM livro l
          INNER JOIN livro_autor la ON la.livro_id = l.id
          INNER JOIN autor a ON a.id = la.autor_id
          WHERE l.id = $1 AND (l.deleted_at is null AND a.deleted_at is null)`,
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const books = result.rows.reduce((acc, row) => {
      const book = acc.get(row.livro_id);

      if (!book) {
        acc.set(row.livro_id, {
          id: row.livro_id,
          titulo: row.titulo,
          editora: row.editora,
          edicao: row.edicao,
          ano_publicacao: row.ano_publicacao,
          codigo: row.codigo,
          baixado: row.baixado,
          isbn: row.isbn,
          autores: [
            {
              id: row.autor_id,
              nome: row.nome_autor,
            },
          ],
        });
        return acc;
      }

      book.autores.push({
        id: row.autor_id,
        nome: row.nome_autor,
      });
      return acc;
    }, new Map<number, Livro>());

    return books.values().next().value ?? null;
  }

  async findAllBooks(): Promise<Livro[]> {
    const result = await this.pool.query(
      `SELECT l.*, la.*, a.nome as nome_autor
          FROM livro l
          INNER JOIN livro_autor la ON la.livro_id = l.id
          INNER JOIN autor a ON a.id = la.autor_id
          WHERE l.deleted_at is null AND a.deleted_at is null
          ORDER BY upper(l.titulo) asc`,
    );

    if (result.rowCount === 0) {
      return [];
    }

    const books = result.rows.reduce((acc, row) => {
      const book = acc.get(row.livro_id);

      if (!book) {
        acc.set(row.livro_id, {
          id: row.livro_id,
          titulo: row.titulo,
          editora: row.editora,
          edicao: row.edicao,
          ano_publicacao: row.ano_publicacao,
          codigo: row.codigo,
          baixado: row.baixado,
          isbn: row.isbn,
          autores: [
            {
              id: row.autor_id,
              nome: row.nome_autor,
            },
          ],
        });
        return acc;
      }

      book.autores.push({
        id: row.autor_id,
        nome: row.nome_autor,
      });

      return acc;
    }, new Map());

    return Array.from(books.values());
  }

  async createBook(book: LivroCreate): Promise<Livro | null> {
    const queryInsert = await this.pool.connect();

    try {
      await queryInsert.query('BEGIN');
      const bookResult = await queryInsert.query(
        `INSERT INTO livro (titulo, editora, edicao, ano_publicacao, codigo, baixado, isbn) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, titulo, editora, edicao, ano_publicacao, codigo, baixado, isbn::text`,
        [
          book.titulo,
          book.editora,
          book.edicao,
          book.ano_publicacao,
          book.codigo,
          book.baixado,
          book.isbn,
        ],
      );

      const bookRow = bookResult.rows[0];

      const placeholders = [];
      const params = [];
      let i = 1;

      for (const author of book.autores) {
        placeholders.push(`($${i}, $${i + 1})`);
        params.push(author.id, bookRow.id);
        i += 2;
      }
      const queryInsertAuthor = `INSERT INTO livro_autor(autor_id, livro_id) VALUES ${placeholders.join(', ')}`;
      await queryInsert.query(queryInsertAuthor, params);

      await queryInsert.query('COMMIT');

      return {
        id: bookRow.id,
        titulo: bookRow.titulo,
        editora: bookRow.editora,
        edicao: bookRow.edicao,
        ano_publicacao: bookRow.ano_publicacao,
        codigo: bookRow.codigo,
        baixado: bookRow.baixado,
        isbn: bookRow.isbn,
        autores: book.autores,
      };
    } catch (error) {
      await queryInsert.query('ROLLBACK');
      throw error;
    } finally {
      queryInsert.release();
    }
  }

  async updateBook(book: Livro): Promise<Livro> {
    const queryInsert = await this.pool.connect();

    try {
      await queryInsert.query('BEGIN');
      const bookResult = await queryInsert.query(
        `UPDATE livro SET titulo = $1, editora = $2, edicao = $3, ano_publicacao = $4, baixado = $5
        WHERE id = $6 AND deleted_at is null 
        RETURNING id, titulo, editora, edicao, ano_publicacao, codigo, baixado, isbn::text`,
        [
          book.titulo,
          book.editora,
          book.edicao,
          book.ano_publicacao,
          book.baixado,
          book.id,
        ],
      );

      const bookRow = bookResult.rows[0];

      await queryInsert.query(
        `DELETE FROM livro_autor
            WHERE livro_id = $1`,
        [book.id],
      );

      const placeholders = [];
      const params = [];
      let i = 1;

      for (const author of book.autores) {
        placeholders.push(`($${i}, $${i + 1})`);
        params.push(author.id, bookRow.id);
        i += 2;
      }
      const queryInsertAuthor = `INSERT INTO livro_autor(autor_id, livro_id) VALUES ${placeholders.join(', ')}`;
      await queryInsert.query(queryInsertAuthor, params);

      await queryInsert.query('COMMIT');

      return {
        id: bookRow.id,
        titulo: bookRow.titulo,
        editora: bookRow.editora,
        edicao: bookRow.edicao,
        ano_publicacao: bookRow.ano_publicacao,
        codigo: bookRow.codigo,
        baixado: bookRow.baixado,
        isbn: bookRow.isbn,
        autores: book.autores,
      };
    } catch (error) {
      await queryInsert.query('ROLLBACK');
      throw error;
    } finally {
      queryInsert.release();
    }
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'UPDATE livro SET deleted_at = NOW() WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async canDeleteBook(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT NOT EXISTS(
        SELECT 1 
        FROM emprestimo_livro el 
        INNER JOIN livro l on l.id = el.livro_id
        WHERE el.livro_id = $1 AND (l.deleted_at is null AND l.baixado = 0 AND el.data_devolucao IS NULL)) as can_delete`,
      [id],
    );

    return rows[0].can_delete;
  }

  async hasActiveBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT EXISTS(
        SELECT 1 
        FROM emprestimo_livro el 
        WHERE el.livro_id = $1 AND el.data_devolucao is null) as has_active_borrow`,
      [id],
    );

    return rows[0].has_active_borrow;
  }
}
