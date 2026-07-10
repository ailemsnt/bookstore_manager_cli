import { Pool } from "pg";
import { Emprestimo } from "../../../domain/emprestimo";
import { EmprestimoRepository } from "../emprestimo.repository";

const sqlSelect = `SELECT e.*, 
                          c.nome as nome_cliente,  c.cpf,
                          l.titulo, l.codigo, a.nome as nome_autor, l.edicao
                    FROM  emprestimo e
                    INNER JOIN livro l on l.id = e.livro_id
                    INNER JOIN cliente c on c.id = e.cliente_id
                    LEFT  JOIN autor a on a.id = l.autor_id `;

export class EmprestimoPostgresRepository implements EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async findBorrowByCostumerId(costumerId: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE c.id = c.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [costumerId],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }  

  async findBorrowByCostumerName(costumerName: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE unaccent(c.nome) ilike unaccent($1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [costumerName],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
    //WHERE lower(unaccent(c.nome)) = lower(unaccent($1)) AND c.deleted_at is null
  async findBorrowByBookId(bookId: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE l.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [bookId],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findBorrowByBookCodeOrIsbn(codeOrIsbn: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE (l.codigo = $1 OR l.isbn = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [codeOrIsbn],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findABorrowByBorrowDate(borrowDate: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE (trunc(e.data_emprestimo) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [borrowDate],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findABorrowByReturnDate(returnDate: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE (trunc(e.data_devolucao) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [returnDate],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findABorrowByExpireDate(expireDate: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE (trunc(e.data_prevista_devolucao) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [expireDate],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findABorrowByStatus(status: string): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `${sqlSelect}
          WHERE (trunc(e.data_prevista_devolucao) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
      [status], //1 - emprestado, 2 - devolvido, 3 - atrasado
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo> {
    const { rows: [row],} = await this.pool.query<Emprestimo>(
      `INSERT INTO emprestimo (livro_id, cliente_id, usuario_id) 
      VALUES ($1, $2, $3)  RETURNING *`,
      [borrow.livro_id, borrow.cliente_id, userId]
    );

    return row;
  }
}