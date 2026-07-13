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
        WHERE (l.disponivel = 1 AND l.deleted_at IS NULL)
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
}