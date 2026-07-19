import { Pool } from 'pg';
import { AutorRepository } from '../autor.repository';
import { Autor } from '../../../domain/autor';

export class AutorPostgresRepository implements AutorRepository {
  constructor(private readonly pool: Pool) {}

  async findAuthorByName(name: string): Promise<Autor | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM autor WHERE lower(unaccent(nome)) = lower(unaccent($1)) AND deleted_at is null ORDER BY nome ASC',
      [name],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAuthorById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM autor WHERE id = $1 AND deleted_at is null',
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAllAuthors(): Promise<Autor[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM autor WHERE deleted_at is null ORDER BY nome ASC',
    );

    return rows;
  }

  async createAuthor(author: Omit<Autor, 'id'>): Promise<Autor> {
    const {
      rows: [row],
    } = await this.pool.query<Autor>(
      'INSERT INTO autor (nome) VALUES ($1) RETURNING *',
      [author.nome],
    );

    return row;
  }

  async updateAuthor(id: number, name: string): Promise<Autor> {
    const {
      rows: [row],
    } = await this.pool.query<Autor>(
      'UPDATE autor SET nome = $1 WHERE id = $2 AND deleted_at is null RETURNING *',
      [name, id],
    );

    return row;
  }

  async deleteAuthor(id: number): Promise<boolean> {
    const result = await this.pool.query('UPDATE autor SET deleted_at = NOW() WHERE id = $1', [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  async canDeleteAuthor(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT NOT EXISTS(
        SELECT 1 
        FROM livro_autor la
        INNER JOIN autor a ON a.id = la.autor_id
        WHERE la.autor_id = $1 AND a.deleted_at is null) as can_delete`,
      [id],
    );

    return rows[0].can_delete;
  }
}
