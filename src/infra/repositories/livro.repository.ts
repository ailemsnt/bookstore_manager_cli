import { Livro, LivroUpdate } from "../../domain/livro";
import { BookListDto } from "../../view/dto/book-list.dto";

export interface LivroRepository {
  findBookByTitle(title: string): Promise<BookListDto[]>;

  findBookById(id: number): Promise<Livro | null>;

  findAllBooks(): Promise<Livro[]>;

  createBook(book: Omit<Livro, "id">): Promise<Livro | null> ;

  updateBook(book: LivroUpdate): Promise<Livro>;

  deleteBook(id: number): Promise<void>;

  canDeleteBook(id: number): Promise<boolean>;

  hasActiveBorrow(id: number): Promise<boolean>;
}