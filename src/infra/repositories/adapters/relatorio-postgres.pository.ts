import { getStatusBorrowBook } from '../../../@common/utils/common.utils';
import { BorrowBookDto } from '../../../view/dto/borrow-list.dto';
import { RelatorioRepository } from '../relatorio.repository';
import { Livro } from './../../../domain/livro';
import { Pool } from 'pg';

export class RelatorioPostgresRepository implements RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async listAvailableBooks (): Promise<Livro[]> {

    const result  = await this.pool.query(        
  `SELECT l.id livro_id, l.codigo, l.titulo, l.editora,
            l.edicao, l.ano_publicacao, l.isbn,
            a.id AS autor_id, a.nome AS nome_autor
        FROM livro l
        INNER JOIN livro_autor la ON la.livro_id = l.id
        INNER JOIN autor a ON a.id = la.autor_id
        WHERE (l.deleted_at IS NULL AND l.disponivel = 1 )
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

  async listUnavailableBooks (): Promise<BorrowBookDto[]> {

    const result  = await this.pool.query(        
  `SELECT l.id livro_id, l.codigo, l.titulo, l.editora,
            l.edicao, l.ano_publicacao, l.isbn,
            a.id AS autor_id, a.nome AS nome_autor,
            c.id AS cliente_id, c.nome AS cliente_nome,
            e.id AS emprestimo_id, e.data_emprestimo
        FROM livro l
        INNER JOIN livro_autor la ON la.livro_id = l.id
        INNER JOIN autor a ON a.id = la.autor_id
        INNER JOIN emprestimo_livro el ON el.livro_id = l.id
        INNER JOIN emprestimo e ON e.id = el.emprestimo_id
        INNER JOIN cliente c ON c.id = e.cliente_id
        WHERE el.data_devolucao IS NULL AND (l.disponivel = 1 AND l.deleted_at IS NULL AND c.deleted_at IS NULL AND e.canceled_at IS NULL)          
        ORDER BY l.titulo ASC`,        
    );
    
    if (result.rowCount === 0) {
      return [];
    }
  
    const books = result.rows.reduce<Record<number, BorrowBookDto>>(
      (acc, row) => {
        const book = acc[row.livro_id];

        if(!book) {
          acc[row.livro_id] = {
            id: row.livro_id,
            codigo: row.codigo,
            titulo: row.titulo,
            editora: row.editora,
            edicao: row.edicao,
            ano_publicacao: row.ano_publicacao,
            isbn: row.isbn,
            cliente_id: row.cliente_d,
            cliente_nome: row.cliente_nome,
            data_emprestimo: row.data_emprestimo,
            data_prevista_devolucao: row.data_prevista_devolucao,
            autor: [
              {
                id: row.autor_id,
                nome: row.nome_autor
              }              
            ],
            status: getStatusBorrowBook(row.data_prevista_devolucao),
          };
          return acc;
        }

        book.autor.push({        
          id: row.autor_id,
          nome: row.nome_autor                                        
        });

        return acc;

      },
      {} as Record<number, BorrowBookDto>,
    );
  
    return Object.values(books);
  }
}