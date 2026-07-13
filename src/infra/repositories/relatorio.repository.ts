import { Livro } from "../../domain/livro";

export interface RelatorioRepository {
  listAvailableBooks (): Promise<Livro[]>
}