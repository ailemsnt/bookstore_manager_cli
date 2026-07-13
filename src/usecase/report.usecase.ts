import { Livro } from "../domain/livro";
import { RelatorioRepository } from "../infra/repositories/relatorio.repository";

export class ReportUseCase {
  constructor(private readonly repository: RelatorioRepository
  ) {}
  
  async listAvailableBooks (): Promise<Livro[]> {
    const book = await this.repository.listAvailableBooks();
    
    return book;
  }
}