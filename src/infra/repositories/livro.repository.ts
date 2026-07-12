import { Livro, LivroUpdate } from "../../domain/livro";

export interface LivroRepository {
  findBookByTitle(title: string): Promise<Livro | null>;

  findBookById(id: number): Promise<Livro | null>;

  findAllBooks(): Promise<Livro[]>;

  createBook(book: Omit<Livro, "id">): Promise<Livro | null> ;

  updateBook(book: LivroUpdate): Promise<Livro>;

  deleteBook(id: number): Promise<void>;

  canDeleteBook(id: number): Promise<boolean>;
}