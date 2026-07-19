import { EmprestimoStatus } from '../../domain/emprestimo';
import { AuthorListDto } from './author-list.dto';
export class BorrowDto {
  constructor(
    public id: number,
    public cliente_id: number,
    public cliente_nome: string,
    public data_emprestimo: Date,
    public livros: BorrowBookDto[],
    public canceled_at?: Date,
  ) {}
}
export class BorrowBookDto {
  constructor(
    public id: number,
    public codigo: string,
    public titulo: string,
    public editora: string,
    public edicao: string,
    public ano_publicacao: number,
    public isbn: string,
    public data_prevista_devolucao: Date,
    public autores: AuthorListDto[],
    public data_devolucao?: Date,
    public cliente_nome?: string,
    public cliente_id?: number,
    public status?: EmprestimoStatus,
    public quantidade_emprestimo?: number,
  ) {}
}
