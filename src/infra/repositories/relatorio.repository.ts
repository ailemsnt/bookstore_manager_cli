import { Livro } from "../../domain/livro";
import { BorrowBookDto } from "../../view/dto/borrow-list.dto";

export interface RelatorioRepository {
  listAvailableBooks (): Promise<Livro[]>;

  listUnavailableBooks (): Promise<BorrowBookDto[]>;
}