import { Livro } from "../domain/livro";
import { RelatorioRepository } from "../infra/repositories/relatorio.repository";
import { BorrowBookDto } from "../view/dto/borrow-list.dto";
import { AuthorReportDto } from "../view/dto/report-list.dto";

export class ReportUseCase {
  constructor(private readonly repository: RelatorioRepository
  ) {}
  
  async listAvailableBooks (): Promise<Livro[]> {
    const book = await this.repository.listAvailableBooks();
    
    return book;
  }

  async listUnavailableBooks (): Promise<BorrowBookDto[]> {
    const book = await this.repository.listUnavailableBooks();
    
    return book;
  }

  async listBooksByAuthor (idAuthor?: number): Promise<AuthorReportDto[]> {
    const author = await this.repository.listBooksByAuthor(idAuthor);
    
    return author;
  }
}