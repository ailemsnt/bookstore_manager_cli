import { AuthorListDto } from './author-list.dto';

export class BookListDto {
  constructor(
    public id: number,
    public codigo: string,
    public titulo: string,
    public editora: string,
    public edicao: string,
    public ano_publicacao: number,
    public isbn: string,
    public baixado: number,
    public autores: AuthorListDto[],
  ) {}
}
