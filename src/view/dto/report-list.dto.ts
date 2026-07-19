import { BookListDto } from './book-list.dto';

export class AuthorReportDto {
  constructor(
    public id: number,
    public nome: string,
    public livros: BookListDto[],
  ) {}
}
