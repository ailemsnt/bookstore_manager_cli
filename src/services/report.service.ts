import { RelatorioRepository } from '../infra/repositories/relatorio.repository';
import { BookListDto } from '../view/dto/book-list.dto';
import { BorrowBookDto, BorrowDto } from '../view/dto/borrow-list.dto';
import { AuthorReportDto } from '../view/dto/report-list.dto';

export class ReportService {
  constructor(private readonly repository: RelatorioRepository) {}

  async listAvailableBooks(): Promise<BookListDto[]> {
    const book = await this.repository.listAvailableBooks();

    return book;
  }

  async listUnavailableBooks(): Promise<BorrowBookDto[]> {
    const book = await this.repository.listUnavailableBooks();

    return book;
  }

  async listBooksByAuthor(idAuthor?: number): Promise<AuthorReportDto[]> {
    const author = await this.repository.listBooksByAuthor(idAuthor);

    return author;
  }

  async listBorrowsCountByBooks(
    dataIni?: Date,
    dataFim?: Date,
  ): Promise<BorrowBookDto[]> {
    const book = await this.repository.listBorrowsCountByBooks(
      dataIni,
      dataFim,
    );

    return book;
  }

  async listCustomerBorrowBooks(idCliente?: number): Promise<BorrowDto[]> {
    const customer = await this.repository.listCustomerBorrowBooks(idCliente);

    return customer;
  }
}
