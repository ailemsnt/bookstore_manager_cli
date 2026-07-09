import { Livro } from "../domain/livro";
import { LivroRepository } from "../infra/repositories/livro.repository";

export class BookUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async search(title: string): Promise<Livro | null> {
    const book = await this.repository.findBookByTitle(title);
    
    return book;
  }

  async findBookById(id: number): Promise<Livro> {
    const book = await this.repository.findBookById(id);
    if (!book) {
      throw new Error("Livro não encontrado");
    }
    return book;
  }

  async findAllBooks(): Promise<Livro[]> {
    const books = await this.repository.findAllBooks();
    if (books.length === 0) {
      throw new Error("Nenhum livro encontrado");
    }
    return books;
  }

  async createBook(book: Omit<Livro, "id">): Promise<Livro> {
    const newBook = await this.repository.createBook(book);
    if (!newBook) {
      throw new Error("Erro ao cadastrar o livro");
    }
    return newBook;
  }

  async updateBook(book: Livro): Promise<Livro> {
    const updatedBook = await this.repository.updateBook(book);
    if (!updatedBook) {
      throw new Error("Erro ao atualizar livro");
    }
    return updatedBook;
  }

  deleteBook(id: number): Promise<void> {     
    return this.repository.deleteBook(id);    
  }
}