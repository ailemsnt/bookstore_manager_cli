import { Pool } from "pg";
import { AutorRepository } from "../autor.repository";
import { Autor } from "../../../domain/autor";

export class AutorPostgresRepository implements AutorRepository{
  constructor(private readonly pool: Pool) {}

  async findAuthorByName(name: string): Promise<Autor | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM autor WHERE lower(unaccent(nome)) = lower(unaccent($1)) AND deletedAt is null",
      [name],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAuthorById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM autor WHERE id = $1 AND deletedAt is null",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAllAuthors(): Promise<Autor[]> {
    const { rows } = await this.pool.query("SELECT * FROM autor WHERE deletedAt is null ORDER BY id");
    
    return rows;      
  }

  async createAuthor(author: Omit<Autor, "id">): Promise<Autor> {
    const {
      rows: [row],
    } = await this.pool.query<Autor>(
      "INSERT INTO autor (nome) VALUES ($1) RETURNING *",
      [author.nome],
    );

    return row;
  }
  
  async updateAuthor(id: number, nome: string): Promise<Autor> {
    const { rows: [row], } = await this.pool.query<Autor>(
      "UPDATE autor SET nome = $1 WHERE id = $2 AND deletedAt is null RETURNING *",
      [nome, id],
    );

    return row;
  }

  async deleteAuthor(id: number): Promise<void> {
    await this.pool.query("UPDATE autor SET deletedAt = NOW() WHERE id = $1", [id]);    
    // if (result.rowCount === 0) {
    //   throw new Error(`Autor com id ${id} não encontrado`);
    // }
  }
}