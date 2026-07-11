import { Autor } from "../domain/autor";
import { Livro, LivroInput, LivroUpdate } from "../domain/livro";
import { LivroRepository } from "../infra/repositories/livro.repository";
import { AuthorUseCase } from "./author.usecase";

export class BookUseCase {
  constructor(private readonly repository: LivroRepository, private readonly authorUc: AuthorUseCase    
  ) {}

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

  async createBook(book: LivroInput): Promise<Livro> {
    const authors: Autor[] = [];
    for (const authorId of authors) {
      const author = await this.authorUc.findAuthorById(Number(authorId));
      if (!author) {
        throw new Error(`Autor ${authorId.nome} não encontrado!`);
      }
      authors.push(author);
    } 

    if (authors.length === 0) {
      throw new Error("O livro deve possuir ao menos um autor!");
    }

    const newBook = await this.repository.createBook(book);
    if (!newBook) {
      throw new Error("Erro ao cadastrar o livro");
    }
    return newBook;
  }

  async updateBook(book: LivroUpdate): Promise<Livro> {
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