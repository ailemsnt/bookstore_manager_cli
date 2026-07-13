import { Pool } from "pg";
import { Emprestimo } from "../../../domain/emprestimo";
import { EmprestimoRepository } from "../emprestimo.repository";
import { getStatusBorrowBook } from "../../../@common/utils/common.utils";

const sqlSelect = `SELECT e.id as emprestimo_id, e.cliente_id, e.data_emprestimo,
    e.canceled_at, c.nome as nome_cliente,  c.cpf,
    l.id as livro_id, l.titulo, l.codigo, l.edicao,
    l.editora, l.ano_publicacao, l.isbn,
    a.id as autor_id, a.nome as nome_autor, el.data_prevista_devolucao, 
    el.data_devolucao	  
FROM  emprestimo e
INNER JOIN cliente c on c.id = e.cliente_id
INNER JOIN emprestimo_livro el on el.emprestimo_id = e.id
INNER JOIN livro l on l.id = el.livro_id
INNER JOIN livro_autor la on la.livro_id = l.id
INNER JOIN autor a on a.id = la.autor_id `;


function createWhereFromStatus(status: number): string {    
  switch (status) {
    case 0: //0 - todos independente o status, menos os cancelados 
      return ' AND (e.canceled_at IS NULL)'; 
    case 1: //1 - em aberto
      return ' AND (el.data_devolucao IS NULL) AND (e.canceled_at IS NULL)';
    case 2: //2 - cancelado
      return ' AND (e.canceled_at IS NOT NULL)';
    case 3: //3 - devolvido
      return ' AND (el.data_devolucao IS NOT NULL) AND (e.canceled_at IS NULL)'; 
    case 4: //4 - atrasado
      return ' AND ((el.data_devolucao IS NULL) AND (DATE(el.data_prevista_devolucao) < CURRENT_DATE)) AND (e.canceled_at IS NULL)';           
    default:
      return ' AND (el.data_devolucao IS NULL) AND (e.canceled_at IS NULL)'; //1 - em aberto
  }
}

export class EmprestimoPostgresRepository implements EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  // async findBorrowByCostumerId(costumerId: number): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE c.id = c.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [costumerId],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }  

  // async findBorrowByCostumerName(costumerName: string): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE unaccent(c.nome) ilike unaccent($1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [costumerName],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }
    //WHERE lower(unaccent(c.nome)) = lower(unaccent($1)) AND c.deleted_at is null
  // async findBorrowByBookId(bookId: number): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE l.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [bookId],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }

  // async findBorrowByBookCodeOrIsbn(codeOrIsbn: string): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE (l.codigo = $1 OR l.isbn = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [codeOrIsbn],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }

  // async findABorrowByBorrowDate(borrowDate: string): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE (trunc(e.data_emprestimo) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [borrowDate],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }

  // async findABorrowByReturnDate(returnDate: string): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE (trunc(e.data_devolucao) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [returnDate],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }

  // async findABorrowByExpireDate(expireDate: string): Promise<Emprestimo | null> {
  //   const { rows } = await this.pool.query(
  //     `${sqlSelect}
  //         WHERE (trunc(e.data_prevista_devolucao) = $1) AND ((c.deleted_at is null) and (l.deleted_at is null) and (a.deleted_at is null))`,
  //     [expireDate],
  //   );

  //   if (rows.length === 0) {
  //     return null;
  //   }

  //   return rows[0];
  // }
  
  //  this.display(" Informe o número da opção desejada:");
  //           this.display(" 1. Pesquisar por ID do empréstimo"); 
  //           this.display(" 2. Pesquisar por Título do livro (informe ao menos 3 letras)"); 
  //           this.display(" 3. Pesquisar por Código ou CPF do cliente");

  async findBorrowById(id: number): Promise<Emprestimo | null>{
    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE e.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null))      
      ORDER BY e.data_emprestimo DESC`, 
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const borrows = result.rows.reduce<Record<number, Emprestimo>>(
      (acc, row) => {
        const borrow = acc[row.emprestimo_id];

        if (!borrow) {
          acc[row.emprestimo_id] = {
            id: row.emprestimo_id, 
            cliente_id: row.cliente_id,
            cliente_nome: row.nome_cliente,
            data_emprestimo: row.data_emprestimo,
            livros: [
              {
                id: row.livro_id,
                codigo: row.codigo,
                titulo: row.titulo,
                editora: row.editora,
                edicao: row.edicao,
                ano_publicacao: row.ano_publicacao,
                isbn: row.isbn,
                data_prevista_devolucao: row.data_prevista_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao)
              }
            ],           
          };
          return acc;
        }

        const bookExists = borrow.livros.find((livro) => livro.id === row.livro_id);
        if (!bookExists) {        
          borrow.livros.push({
            id: row.livro_id,
            codigo: row.codigo,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            isbn: row.isbn,
            data_prevista_devolucao: row.data_prevista_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao) 
          });
        }

        if (bookExists) {
          const authorExists = bookExists.autores.some((autor) => autor.id === row.autor_id);
          if (!authorExists) {
            bookExists.autores.push({
              id: row.autor_id,
              nome: row.nome_autor,
            });
          }
        }

        return acc;
      },
      {} as Record<number, Emprestimo>,
    );

    return Object.values(borrows)[0];
  }

  async findBorrowByStatus(status: number): Promise<Emprestimo[]> {
    const sqlWhereStatus = createWhereFromStatus(status);

    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE e.id > 0 AND ((c.deleted_at is null) and (l.deleted_at is null))
      ${sqlWhereStatus}
      ORDER BY e.data_emprestimo DESC`,
    );

    if (result.rowCount === 0) {
      return [];
    }

    const borrows = result.rows.reduce<Record<number, Emprestimo>>(
      (acc, row) => {
        const borrow = acc[row.emprestimo_id];

        if (!borrow) {
          acc[row.emprestimo_id] = {
            id: row.emprestimo_id, 
            cliente_id: row.cliente_id,
            cliente_nome: row.nome_cliente,
            data_emprestimo: row.data_emprestimo,
            livros: [
              {
                id: row.livro_id,
                codigo: row.codigo,
                titulo: row.titulo,
                editora: row.editora,
                edicao: row.edicao,
                ano_publicacao: row.ano_publicacao,
                isbn: row.isbn,
                data_prevista_devolucao: row.data_prevista_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao)
              }
            ],           
          };
          return acc;
        }

        const bookExists = borrow.livros.find((livro) => livro.id === row.livro_id);
        if (!bookExists) {        
          borrow.livros.push({
            id: row.livro_id,
            codigo: row.codigo,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            isbn: row.isbn,
            data_prevista_devolucao: row.data_prevista_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao) 
          });
        }

        if (bookExists) {
          const authorExists = bookExists.autores.some((autor) => autor.id === row.autor_id);
          if (!authorExists) {
            bookExists.autores.push({
              id: row.autor_id,
              nome: row.nome_autor,
            });
          }
        }

        return acc;
      },
      {} as Record<number, Emprestimo>,
    );

    return Object.values(borrows);
  }

  async findBorrowByBook(status: number): Promise<Emprestimo[]> {
    const sqlWhereStatus = createWhereFromStatus(status);

    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE e.id > 0 AND ((c.deleted_at is null) and (l.deleted_at is null))
      ${sqlWhereStatus}
      ORDER BY e.data_emprestimo DESC`,
    );

    if (result.rowCount === 0) {
      return [];
    }

    const borrows = result.rows.reduce<Record<number, Emprestimo>>(
      (acc, row) => {
        const borrow = acc[row.emprestimo_id];

        if (!borrow) {
          acc[row.emprestimo_id] = {
            id: row.emprestimo_id, 
            cliente_id: row.cliente_id,
            cliente_nome: row.nome_cliente,
            data_emprestimo: row.data_emprestimo,
            livros: [
              {
                id: row.livro_id,
                codigo: row.codigo,
                titulo: row.titulo,
                editora: row.editora,
                edicao: row.edicao,
                ano_publicacao: row.ano_publicacao,
                isbn: row.isbn,
                data_prevista_devolucao: row.data_prevista_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao)
              }
            ],           
          };
          return acc;
        }

        const bookExists = borrow.livros.find((livro) => livro.id === row.livro_id);
        if (!bookExists) {        
          borrow.livros.push({
            id: row.livro_id,
            codigo: row.codigo,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            isbn: row.isbn,
            data_prevista_devolucao: row.data_prevista_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao) 
          });
        }

        if (bookExists) {
          const authorExists = bookExists.autores.some((autor) => autor.id === row.autor_id);
          if (!authorExists) {
            bookExists.autores.push({
              id: row.autor_id,
              nome: row.nome_autor,
            });
          }
        }

        return acc;
      },
      {} as Record<number, Emprestimo>,
    );

    return Object.values(borrows);
  }

  // async createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo> {
  //   const { rows: [row],} = await this.pool.query<Emprestimo>(
  //     `INSERT INTO emprestimo (livro_id, cliente_id, usuario_id) 
  //     VALUES ($1, $2, $3)  RETURNING *`,
  //  ///   [borrow.livro_id, borrow.cliente_id, userId]
  //   );

  //   return row;
  // }

  async canBorrowBook(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
    `SELECT EXISTS (
      SELECT 1
      FROM livro l
      WHERE l.id = $1
        AND l.disponivel = 1
        AND (l.deleted_at IS NULL)
        AND NOT EXISTS (
            SELECT 1
            FROM emprestimo_livro el
            WHERE el.livro_id = l.id
              AND (el.data_devolucao NOT IS NULL)
        )) AS can_borrow;`,
      [id]);
    
      return (rows.length === 0);
  }

  async canCancelBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT EXISTS (
        SELECT 1
        FROM emprestimo e
        WHERE e.id = 10
          AND (e.canceled_at IS NULL)
          AND NOT EXISTS (
              SELECT 1
              FROM emprestimo_livro el
              WHERE el.emprestimo_id = e.id
                AND (el.data_devolucao IS NOT NULL))) as can_cancel`,
        [id]
    );

    return (rows.length === 0);
  }

  async cancelBorrow(id: number): Promise<boolean> {
    const queryUpdate = await this.pool.connect();

    try {
      await queryUpdate.query('BEGIN');

      await queryUpdate.query(
        `UPDATE emprestimo_livro set data_devolucao = NOW() WHERE emprestimo_id = $1`,
        [id]
      );

      const result = await queryUpdate.query(
        `UPDATE emprestimo set canceled_at = NOW() WHERE id = $1	AND canceled_at IS NULL`,
        [id]
      );

      await queryUpdate.query('COMMIT');

      return (result.rowCount !== 0);

    } catch (error) {
      await queryUpdate.query('ROLLBACK');
      throw error;
    } finally {
      queryUpdate.release();
    }
  }
}