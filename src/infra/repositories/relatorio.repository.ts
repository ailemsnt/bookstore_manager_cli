import { Livro } from "../../domain/livro";
import { BorrowBookDto } from "../../view/dto/borrow-list.dto";
import { AuthorReportDto } from "../../view/dto/report-list.dto";

export interface RelatorioRepository {
  listAvailableBooks (): Promise<Livro[]>;

  listUnavailableBooks (): Promise<BorrowBookDto[]>;

  listBooksByAuthor (idAuthor?: number): Promise<AuthorReportDto[]>;
}