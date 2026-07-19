import { BookListDto } from '../../view/dto/book-list.dto';
import { BorrowBookDto, BorrowDto } from '../../view/dto/borrow-list.dto';
import { AuthorReportDto } from '../../view/dto/report-list.dto';

export interface RelatorioRepository {

  listAvailableBooks(): Promise<BookListDto[]> 

  listUnavailableBooks(): Promise<BorrowBookDto[]>;

  listBooksByAuthor(idAuthor?: number): Promise<AuthorReportDto[]>;

  listBorrowsCountByBooks(
    dataIni?: Date,
    dataFim?: Date,
  ): Promise<BorrowBookDto[]>;

  listCustomerBorrowBooks(idCliente?: number): Promise<BorrowDto[]>;
}
