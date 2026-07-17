import { Pool } from "pg";
import { Emprestimo, EmprestimoRetorno } from "../../../domain/emprestimo";
import { EmprestimoRepository } from "../emprestimo.repository";
import { getStatusBorrowBook } from "../../../@common/utils/common.utils";
import { BorrowDto } from "../../../view/dto/borrow-list.dto";
import { BorrowFilterDto } from "../../../view/dto/borrow-filter.dto";
import { BorrowFormDto } from "../../../view/dto/borrow-form.dto";

const sqlSelect = `SELECT e.id as emprestimo_id, e.cliente_id, e.data_emprestimo,
    e.canceled_at, c.nome as nome_cliente,  c.cpf,
    l.id as livro_id, l.titulo, l.codigo, l.edicao,
    l.editora, l.ano_publicacao, l.isbn, el.data_devolucao,
    a.id as autor_id, a.nome as nome_autor, el.data_prevista_devolucao, 
    el.data_devolucao, e.canceled_at as data_cancelamento	  
FROM  emprestimo e
INNER JOIN cliente c on c.id = e.cliente_id
INNER JOIN emprestimo_livro el on el.emprestimo_id = e.id
INNER JOIN livro l on l.id = el.livro_id
INNER JOIN livro_autor la on la.livro_id = l.id
INNER JOIN autor a on a.id = la.autor_id `;


function createConditionByStatus(status?: number) : string {
  switch (status) {
    case 0: //0 - todos exceto os cancelados 
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
      return ' '; //todos
  }
}
export class EmprestimoPostgresRepository implements EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async findBorrowById(id: number): Promise<BorrowDto | null>{
    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE e.id = $1 AND ((c.deleted_at is null) and (l.deleted_at is null))      
      ORDER BY e.data_emprestimo DESC`, 
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const borrows = result.rows.reduce<Map<number, BorrowDto>>(
      (acc, row) => {
        const borrow = acc.get(row.emprestimo_id);

        if (!borrow) {
          acc.set(row.emprestimo_id, {
            id: row.emprestimo_id, 
            cliente_id: row.cliente_id,
            cliente_nome: row.nome_cliente,
            data_emprestimo: row.data_emprestimo,
            canceled_at: row.data_cancelamento,
            livros: [
              {
                id: row.livro_id,
                codigo: row.codigo,
                titulo: row.titulo,
                edicao: row.edicao,
                editora: row.editora,
                ano_publicacao: row.ano_publicacao,
                isbn: row.isbn,
                data_prevista_devolucao: row.data_prevista_devolucao,
                data_devolucao: row.data_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, row.data_cancelamento)
              }
            ],           
          });
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
            data_devolucao: row.data_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, borrow.canceled_at) 
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
      new Map<number, BorrowDto>(),
    );

    return borrows.values().next().value ?? null;
  }

  async findBorrowFilter(filters : BorrowFilterDto): Promise<Emprestimo[]> {
    const params: (number)[] = [];
    const sqlWhereStatus = createConditionByStatus(filters.status);   
    const sqlWhereCustomer = filters.clienteId ? ` AND e.cliente_id = $${params.push(filters.clienteId)}`: ''; 
    const sqlWhereBook = filters.livroId ? ` AND l.id = $${params.push(filters.livroId)}`: '';

    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE ((c.deleted_at is null) and (l.deleted_at is null))
      ${sqlWhereStatus}
      ${sqlWhereCustomer}
      ${sqlWhereBook}
      ORDER BY e.data_emprestimo DESC`,
      params
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
            canceled_at: row.data_cancelamento,
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
                data_devolucao: row.data_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, row.data_cancelamento)
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
            data_devolucao: row.data_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, borrow.canceled_at) 
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
    const sqlWhereStatus = createConditionByStatus(status);

    const result = await this.pool.query(
      `${sqlSelect} 
      WHERE ((c.deleted_at is null) and (l.deleted_at is null))
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
            canceled_at: row.data_cancelamento,
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
                data_devolucao: row.data_devolucao,
                autores: [
                  {
                    id: row.autor_id,
                    nome: row.nome_autor
                  }
                ],
                status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, row.data_cancelamento)
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
            data_devolucao: row.data_devolucao,
            autores: [
              {
                id: row.autor_id,
                nome: row.nome_autor,
              }
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao, row.data_devolucao, borrow.canceled_at) 
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

  async createBorrow(borrow: BorrowFormDto, livrosId: number[], userId: number): Promise<EmprestimoRetorno | null> {
    const queryInsert = await this.pool.connect();

    try {
      await queryInsert.query('BEGIN');
      const borrowResult = await queryInsert.query(
        `INSERT INTO emprestimo (cliente_id, usuario_id) 
        VALUES ($1, $2)  RETURNING id, cliente_id `,
        [borrow.cliente_id, userId]
      );

      const borrowRow = borrowResult.rows[0];      

      const placeholders = [];
      const params = [];
      let i = 1;

      for (const livroId of livrosId) {
        placeholders.push(`($${i}, $${i + 1})`);
        params.push(borrowRow.id, livroId);
        i += 2;
      }

      const queryInsertBook = `INSERT INTO emprestimo_livro (emprestimo_id, livro_id) VALUES ${placeholders.join(', ')}`;
      await queryInsert.query(queryInsertBook, params);

      await queryInsert.query('COMMIT');

      return {
        id: borrowRow.id,            
        cliente_id: borrowRow.cliente_id
      }

    } catch(error) {
      await queryInsert.query('ROLLBACK');
      throw error;
    } finally {
      queryInsert.release();
    }
  }

  async canBorrowBook(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
    `SELECT EXISTS (
      SELECT 1
      FROM livro l
      WHERE l.id = $1
        AND l.baixado = 0
        AND (l.deleted_at IS NULL)
        AND NOT EXISTS (
            SELECT 1
            FROM emprestimo_livro el
            WHERE el.livro_id = l.id
              AND (el.data_devolucao IS NOT NULL))
            ) AS can_borrow`,
      [id]);
    
      return (rows[0].can_borrow);
  }

  async canReturnBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
    `SELECT EXISTS (
      SELECT 1
      FROM emprestimo e
      INNER JOIN emprestimo_livro el 
        ON el.emprestimo_id = e.id
      WHERE e.id = $1
        AND e.canceled_at IS NULL
        AND el.data_devolucao IS NULL
      ) AS can_return;`,
      [id]);
    
      return (rows[0].can_return);
  }

  async canCancelBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT EXISTS (
        SELECT 1
        FROM emprestimo e
        WHERE e.id = $1
          AND (e.canceled_at IS NULL)
          AND NOT EXISTS (
              SELECT 1
              FROM emprestimo_livro el
              WHERE el.emprestimo_id = e.id
                AND (el.data_devolucao IS NOT NULL))
              ) as can_cancel`,
        [id]
    );

    return (rows[0].can_cancel);
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

  async returnBorrow(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
        `UPDATE emprestimo_livro set data_devolucao = NOW() WHERE emprestimo_id = $1`,
        [id]
      );
    return (rows.length === 0);
  }
}