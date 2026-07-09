import { Livro } from "../../domain/livro";
import { LivroUpdate } from "../../domain/livroUpdate";

export interface LivroRepository {
  findBookByTitle(title: string): Promise<Livro | null>;

  findBookById(id: number): Promise<Livro | null>;

  findAllBooks(): Promise<Livro[]>;

  createBook(book: Omit<Livro, "id">): Promise<Livro>;

  updateBook(book: LivroUpdate): Promise<Livro>;

  deleteBook(id: number): Promise<void>;
}