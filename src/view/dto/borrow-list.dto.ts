import { AuthorListDto } from "./author-list.dto";

export class BorrowBookDto {
  constructor(
    public id: number,
    public codigo: string,
    public titulo: string,
    public editora: string,
    public edicao: string,
    public ano_publicacao: number,
    public isbn: string,

    public cliente_id: number,
    public cliente_nome: string,

    public data_emprestimo: Date,
    public data_prevista_devolucao: Date,

    public autor: AuthorListDto[],
    public status: string
  ) {}
}