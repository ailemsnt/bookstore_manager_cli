import { Pool } from "pg";
import { Livro } from "../../../domain/livro";
import { LivroRepository } from "../livro.repository";

export class LivroPostgresRepository implements LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findBookByTitle(title: string): Promise<Livro | null> {
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
      return null;
    }

    return rows[0];
  }

  async findBookById(id: number): Promise<Livro | null> {
    const result  = await this.pool.query(        
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

    const books = result.rows.reduce<Record<number, Livro>>(
      (acc, row) => {
        const book = acc[row.livro_id];

        if(!book) {
          acc[row.livro_id] = {
            id: row.livro_id,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            codigo: row.codigo,
            disponivel: row.disponivel,
            isbn: row.isbn,
            autor: [
              {
                id: row.autor_id,
                nome: row.nome_autor
              }              
            ],
          };
          return acc;
        }

        book.autor.push({        
          id: row.autor_id,
          nome: row.nome_autor                                        
        });

        return acc;

      },
      {} as Record<number, Livro>,
    );

    return Object.values(books)[0];
  }

  async findAllBooks(): Promise<Livro[]> {
    const result  = await this.pool.query(        
        `SELECT l.*, la.*, a.nome as nome_autor
          FROM livro l
          INNER JOIN livro_autor la ON la.livro_id = l.id
          INNER JOIN autor a ON a.id = la.autor_id
          WHERE l.deleted_at is null AND a.deleted_at is null
          ORDER BY l.titulo asc`        
    );

    if (result.rowCount === 0) {
      return [];
    }

    const books = result.rows.reduce<Record<number, Livro>>(
      (acc, row) => {
        const book = acc[row.livro_id];

        if(!book) {
          acc[row.livro_id] = {
            id: row.livro_id,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            codigo: row.codigo,
            disponivel: row.disponivel,
            isbn: row.isbn,
            autor: [
              {
                id: row.autor_id,
                nome: row.nome_autor
              }              
            ],
          };
          return acc;
        }

        book.autor.push({        
          id: row.autor_id,
          nome: row.nome_autor                                        
        });

        return acc;

      },
      {} as Record<number, Livro>,
    );

    return Object.values(books);
  }

  async createBook(book: Omit<Livro, "id">): Promise<Livro | null> {
    const queryInsert = await this.pool.connect();

    try {
      await queryInsert.query('BEGIN');
      const bookResult = await queryInsert.query(
        `INSERT INTO livro (titulo, editora, edicao, ano_publicacao, codigo, disponivel, isbn) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, titulo, editora, edicao, ano_publicacao, codigo, disponivel, isbn::text`,
        [book.titulo, book.editora, book.edicao, book.ano_publicacao, book.codigo, book.disponivel, book.isbn]
      );

      const bookRow = bookResult.rows[0];      

      // for (const author of book.autor) {
      //   await queryInsert.query(
      //     `INSERT INTO livro_autor(autor_id, livro_id)
      //     VALUES ($1, $2)`,//adicionar todos de uma vez
      //   [author.id, bookRow.id]);
      // }

      const placeholders = [];
      const params = [];
      let i = 1;

      for (const { autorId, livroId } of bookRow) {
        placeholders.push(`($${i}, $${i + 1})`);
        params.push(autorId, livroId);
        i += 2;
      }
      const queryInsertAuthor = `INSERT INTO livro_autor(autor_id, livro_id) VALUES ${placeholders.join(', ')}`;
      await this.pool.query(queryInsertAuthor, params);

  

      await queryInsert.query('COMMIT');

      return {
        id: bookRow.id,
        titulo: bookRow.titulo,            
        editora: bookRow.editora,
        edicao: bookRow.edicao,
        ano_publicacao: bookRow.ano_publicacao,
        codigo: bookRow.codigo,
        disponivel: bookRow.disponivel,
        isbn: bookRow.isbn,
        autor: book.autor
      }

    } catch(error) {
      await queryInsert.query('ROLLBACK');
      throw error;
    } finally {
      queryInsert.release();
    }
  }

  async updateBook(book: Livro): Promise<Livro>{
    const { rows: [row], } = await this.pool.query<Livro>(
      `UPDATE livro SET titulo = $1, autor_id = $2, editora = $3, edicao = $4, ano_publicacao = $5, disponivel = $6
        WHERE id = $7 AND deleted_at is null RETURNING *`,
      [book.titulo, book.editora, book.edicao, book.ano_publicacao, book.disponivel, book.id],
        );
    return row;
  }

  async deleteBook(id: number): Promise<void> {
    const result = await this.pool.query("UPDATE livro SET deleted_at = NOW() WHERE id = $1", [id]);
  }

  async canDeleteBook(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT EXISTS(
        SELECT 1 
        FROM emprestimo_livro el 
        INNER JOIN livro l on l.id = el.livro_id
        WHERE el.livro_id = $1 AND (l.deleted_at is null AND l.disponivel = 0)as can_delete`,[id]
    );

    return (rows.length === 0);
  }

  async hasActiveBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT EXISTS(
        SELECT 1 
        FROM emprestimo_livro el 
        WHERE el.livro_id = $1 AND el.data_devolucao is null) as has_active_borrow`,
        [id]
    )

    return (rows.length === 0);
  }
}