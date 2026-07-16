import { AuthorListDto } from "./author-list.dto";
import { BookDto } from "./book-list.dto";

export class AuthorReportDto {
  constructor(
    public id: number,
    public nome: string, 
    public livros: BookDto[]
  ) {}
}