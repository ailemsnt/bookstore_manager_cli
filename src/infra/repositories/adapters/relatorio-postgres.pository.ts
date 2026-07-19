import { Pool } from 'pg';
import { BookListDto } from '../../../view/dto/book-list.dto';
import { BorrowBookDto, BorrowDto } from '../../../view/dto/borrow-list.dto';
import { AuthorReportDto } from '../../../view/dto/report-list.dto';
import { getStatusBorrowBook } from '../../../view/utils/view-utils';
import { RelatorioRepository } from '../relatorio.repository';
export class RelatorioPostgresRepository implements RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async listAvailableBooks(): Promise<BookListDto[]> {
    const result = await this.pool.query(
      `SELECT l.id livro_id, l.codigo, l.titulo, l.editora,
            l.edicao, l.ano_publicacao, l.isbn,
            a.id AS autor_id, a.nome AS nome_autor
        FROM livro l
        INNER JOIN livro_autor la ON la.livro_id = l.id
        INNER JOIN autor a ON a.id = la.autor_id
        WHERE (l.deleted_at IS NULL AND l.baixado = 0 )
          AND NOT EXISTS (
              SELECT 1
              FROM emprestimo_livro el
              WHERE el.livro_id = l.id
                AND el.data_devolucao IS NULL
          )
        ORDER BY l.titulo ASC`,
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

  async listUnavailableBooks(): Promise<BorrowBookDto[]> {
    const result = await this.pool.query(
      `SELECT l.id livro_id, l.codigo, l.titulo, l.editora,
            l.edicao, l.ano_publicacao, l.isbn,
            a.id AS autor_id, a.nome AS nome_autor,
            c.id AS cliente_id, c.nome AS cliente_nome,
            e.id AS emprestimo_id, e.data_emprestimo,
            el.data_prevista_devolucao
        FROM livro l
        INNER JOIN livro_autor la ON la.livro_id = l.id
        INNER JOIN autor a ON a.id = la.autor_id
        INNER JOIN emprestimo_livro el ON el.livro_id = l.id
        INNER JOIN emprestimo e ON e.id = el.emprestimo_id
        INNER JOIN cliente c ON c.id = e.cliente_id
        WHERE el.data_devolucao IS NULL AND (l.baixado = 0 AND l.deleted_at IS NULL AND c.deleted_at IS NULL AND e.canceled_at IS NULL)          
        ORDER BY l.titulo ASC`,
    );

    if (result.rowCount === 0) {
      return [];
    }

    const books = result.rows.reduce((acc, row) => {
      const book = acc.get(row.livro_id);

      if (!book) {
        acc.set(row.livro_id, {
          id: row.livro_id,
          codigo: row.codigo,
          titulo: row.titulo,
          editora: row.editora,
          edicao: row.edicao,
          ano_publicacao: row.ano_publicacao,
          isbn: row.isbn,
          cliente_id: row.cliente_id,
          cliente_nome: row.cliente_nome,
          data_emprestimo: row.data_emprestimo,
          data_prevista_devolucao: row.data_prevista_devolucao,
          autores: [
            {
              id: row.autor_id,
              nome: row.nome_autor,
            },
          ],
          status: getStatusBorrowBook(row.data_prevista_devolucao),
        });
        return acc;
      }

      book.autores.push({
        id: row.autor_id,
        nome: row.nome_autor,
      });

      return acc;
    }, new Map<number, BorrowBookDto>());

    return Array.from(books.values());
  }

  async listBooksByAuthor(idAuthor?: number): Promise<AuthorReportDto[]> {
    //condicao = autor id ou todos
    const conditionValidate = idAuthor !== undefined && idAuthor > 0;
    const paramsAuthor = conditionValidate ? [idAuthor] : [];
    const sqlWhereCondition = conditionValidate ? `AND a.id = $1` : '';

    const sqlAuthor = `SELECT a.id AS autor_id, a.nome AS nome_autor,
          l.id AS livro_id, l.codigo, l.titulo, l.editora, l.edicao,
          l.ano_publicacao, l.isbn, l.baixado
      FROM autor a
      INNER JOIN livro_autor la ON la.autor_id = a.id
      INNER JOIN livro l ON l.id = la.livro_id
      WHERE (a.deleted_at IS NULL) AND (l.deleted_at IS NULL AND l.baixado = 0)
      ${sqlWhereCondition}
      ORDER BY a.nome ASC`;
    //AND ($1 IS NULL OR a.id = $1)
    const result = await this.pool.query(sqlAuthor, paramsAuthor);

    if (result.rowCount === 0) {
      return [];
    }

    const authors = result.rows.reduce((acc, row) => {
      const author = acc.get(row.autor_id);

      if (!author) {
        acc.set(row.autor_id, {
          id: row.autor_id,
          nome: row.nome_autor,
          livros: [
            {
              id: row.livro_id,
              titulo: row.titulo,
              editora: row.editora,
              edicao: row.edicao,
              ano_publicacao: row.ano_publicacao,
              codigo: row.codigo,
              baixado: row.baixado,
              isbn: row.isbn,
            },
          ],
        });
        return acc;
      }

      author.livros.push({
        id: row.livro_id,
        titulo: row.titulo,
        editora: row.editora,
        edicao: row.edicao,
        ano_publicacao: row.ano_publicacao,
        codigo: row.codigo,
        baixado: row.baixado,
        isbn: row.isbn,
      });

      return acc;
    }, new Map());

    return Array.from(authors.values());
  }

  async listBorrowsCountByBooks(
    dataIni?: Date,
    dataFim?: Date,
  ): Promise<BorrowBookDto[]> {
    const conditionValidate = dataIni !== undefined && dataFim !== undefined;
    const paramsBorrow = conditionValidate ? [dataIni, dataFim] : [];
    const sqlWhereCondition = conditionValidate
      ? `AND e.data_emprestimo >= $1 AND e.data_emprestimo <= $2`
      : '';

    const sqlBorrow = `SELECT l.id AS livro_id, l.codigo, l.titulo, l.editora,
          l.edicao,l.ano_publicacao,l.isbn,
          a.id AS autor_id, a.nome AS nome_autor,
          COALESCE(emp.quantidade_emprestimos, 0) AS quantidade_emprestimos
      FROM livro l
      INNER JOIN livro_autor la ON la.livro_id = l.id
      INNER JOIN autor a ON a.id = la.autor_id
      LEFT JOIN (
          SELECT el.livro_id, COUNT(e.id) AS quantidade_emprestimos
          FROM emprestimo_livro el
          INNER JOIN emprestimo e ON e.id = el.emprestimo_id
          WHERE e.canceled_at IS NULL
          ${sqlWhereCondition}
          GROUP BY el.livro_id
      ) emp ON emp.livro_id = l.id
      WHERE l.baixado = 0 AND l.deleted_at IS NULL
      ORDER BY emp.quantidade_emprestimos DESC`;

    const result = await this.pool.query(sqlBorrow, paramsBorrow);

    if (result.rowCount === 0) {
      return [];
    }

    const books = result.rows.reduce((acc, row) => {
      const book = acc.get(row.livro_id);

      if (!book) {
        acc.set(row.livro_id, {
          id: row.livro_id,
          codigo: row.codigo,
          titulo: row.titulo,
          editora: row.editora,
          edicao: row.edicao,
          ano_publicacao: row.ano_publicacao,
          isbn: row.isbn,
          cliente_id: row.cliente_id,
          cliente_nome: row.cliente_nome,
          data_emprestimo: row.data_emprestimo,
          data_prevista_devolucao: row.data_prevista_devolucao,
          autores: [
            {
              id: row.autor_id,
              nome: row.nome_autor,
            },
          ],
          quantidade_emprestimo: row.quantidade_emprestimos,
        });
        return acc;
      }

      book.autores.push({
        id: row.autor_id,
        nome: row.nome_autor,
      });

      return acc;
    }, new Map<number, BorrowBookDto>());

    return Array.from(books.values());
  }

  async listCustomerBorrowBooks(idCliente?: number): Promise<BorrowDto[]> {
    const conditionValidate = idCliente !== undefined && idCliente > 0;
    const paramsCustomer = conditionValidate ? [idCliente] : [];
    const sqlWhereCondition = conditionValidate ? ` c.id = $1 AND ` : '';

    const sqlCustomer = `SELECT l.id livro_id, l.codigo, l.titulo, l.editora,
            l.edicao, l.ano_publicacao, l.isbn,
            a.id AS autor_id, a.nome AS nome_autor,
            c.id AS cliente_id, c.nome AS cliente_nome,
            e.id AS emprestimo_id, e.data_emprestimo,
            el.data_prevista_devolucao, el.data_devolucao
        FROM livro l
        INNER JOIN livro_autor la ON la.livro_id = l.id
        INNER JOIN autor a ON a.id = la.autor_id
        INNER JOIN emprestimo_livro el ON el.livro_id = l.id
        INNER JOIN emprestimo e ON e.id = el.emprestimo_id
        INNER JOIN cliente c ON c.id = e.cliente_id
        WHERE 
        ${sqlWhereCondition}         
        (l.baixado = 0 AND l.deleted_at IS NULL AND c.deleted_at IS NULL AND e.canceled_at IS NULL)  
        AND (el.data_devolucao IS NULL)        
        ORDER BY a.nome, l.titulo ASC`;

    const result = await this.pool.query(sqlCustomer, paramsCustomer);

    if (result.rowCount === 0) {
      return [];
    }

    const customers = result.rows.reduce<Map<number, BorrowDto>>((acc, row) => {
      const borrow = acc.get(row.emprestimo_id);

      if (!borrow) {
        acc.set(row.emprestimo_id, {
          id: row.emprestimo_id,
          cliente_id: row.cliente_id,
          cliente_nome: row.cliente_nome,
          data_emprestimo: row.data_emprestimo,
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
                  nome: row.nome_autor,
                },
              ],
              status: getStatusBorrowBook(
                row.data_prevista_devolucao,
                row.data_devolucao,
              ),
            },
          ],
        });
        return acc;
      }

      const bookExists = borrow.livros.find(
        (livro) => livro.id === row.livro_id,
      );
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
            },
          ],
          status: getStatusBorrowBook(
            row.data_prevista_devolucao,
            row.data_devolucao,
          ),
        });
      }

      if (bookExists) {
        const authorExists = bookExists.autores.some(
          (autor) => autor.id === row.autor_id,
        );
        if (!authorExists) {
          bookExists.autores.push({
            id: row.autor_id,
            nome: row.nome_autor,
          });
        }
      }

      return acc;
    }, new Map<number, BorrowDto>());

    return Array.from(customers.values());
  }
}
