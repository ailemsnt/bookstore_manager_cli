import { Livro } from '../../domain/livro';
import { BookListDto } from '../../view/dto/book-list.dto';

export interface LivroRepository {
  findBookByTitle(title: string): Promise<BookListDto[]>;

  findBookById(id: number): Promise<Livro | null>;

  findAllBooks(): Promise<Livro[]>;

  findBookByInternalCodeIsbn(
    internalCode: string,
    isbn: number,
  ): Promise<Livro | null>;

  createBook(book: Omit<Livro, 'id'>): Promise<Livro | null>;

  updateBook(book: Livro): Promise<Livro>;

  deleteBook(id: number): Promise<boolean>;

  canDeleteBook(id: number): Promise<boolean>;

  hasActiveBorrow(id: number): Promise<boolean>;
}
