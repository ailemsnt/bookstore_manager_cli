import { Livro } from "../../domain/livro";
import { BorrowBookDto, BorrowDto } from "../../view/dto/borrow-list.dto";
import { AuthorReportDto } from "../../view/dto/report-list.dto";

export interface RelatorioRepository {
  listAvailableBooks (): Promise<Livro[]>;

  listUnavailableBooks (): Promise<BorrowBookDto[]>;

  listBooksByAuthor (idAuthor?: number): Promise<AuthorReportDto[]>;
  
  listBorrowsCountByBooks (dataIni?: Date, dataFim?: Date): Promise<BorrowBookDto[]>;

  listCostumerBorrowBooks (idCliente?: number): Promise<BorrowDto[]>;
}