import { Autor } from '../domain/autor';
import { LivroRepository } from '../infra/repositories/livro.repository';
import { AuthorService } from './author.service';
import { Livro, LivroInput, LivroUpdate } from '../domain/livro';
import { BookListDto } from '../view/dto/book-list.dto';

export class BookService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly authorSrv: AuthorService,
  ) {}

  async search(title: string): Promise<BookListDto[]> {
    const book = await this.repository.findBookByTitle(title);

    return book;
  }

  async findBookById(id: number): Promise<Livro> {
    const book = await this.repository.findBookById(id);
    if (!book) {
      throw new Error('Livro não encontrado');
    }

    return book;
  }

  async findBookByInternalCodeIsbn(
    internalCode: string,
    isbn: number,
  ): Promise<Livro | null> {
    const book = await this.repository.findBookByInternalCodeIsbn(
      internalCode,
      isbn,
    );

    return book;
  }

  async findAllBooks(): Promise<Livro[]> {
    const books = await this.repository.findAllBooks();
    if (books.length === 0) {
      throw new Error('Nenhum livro encontrado');
    }
    return books;
  }

  async createBook(input: LivroInput): Promise<Livro> {
    const authors: Autor[] = [];

    if (input.autores.length === 0) {
      throw new Error('O livro deve possuir ao menos um autor!');
    }

    for (const authorId of input.autores) {
      const author = await this.authorSrv.findAuthorById(authorId);

      if (!author) {
        throw new Error(`Autor ${authorId} não encontrado`);
      }

      authors.push(author);
    }

    const book = {
      titulo: input.titulo,
      editora: input.editora,
      edicao: input.edicao,
      ano_publicacao: input.ano_publicacao,
      codigo: input.codigo,
      baixado: input.baixado,
      isbn: input.isbn,
      autores: authors,
    };

    const newBook = await this.repository.createBook(book);
    if (!newBook) {
      throw new Error('Erro ao cadastrar o livro');
    }

    return newBook;
  }

  async updateBook(input: LivroUpdate): Promise<Livro> {
    const authors: Autor[] = [];

    for (const authorId of input.autores) {
      const author = await this.authorSrv.findAuthorById(authorId);
      if (!author) {
        throw new Error(`Autor ${author} não encontrado`);
      }
      authors.push(author);
    }

    const book: Livro = {
      id: Number(input.id),
      titulo: input.titulo,
      editora: input.editora,
      edicao: input.edicao,
      ano_publicacao: input.ano_publicacao,
      baixado: input.baixado,
      codigo: '',
      isbn: '',
      autores: authors,
    };

    const updatedBook = await this.repository.updateBook(book);
    if (!updatedBook) {
      throw new Error('Erro ao atualizar livro');
    }
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    const bookDeleted = this.repository.deleteBook(id);
    if (!bookDeleted) {
      throw new Error('Erro ao excluir o livro');
    }
    return bookDeleted;
  }

  async canDeleteBook(id: number): Promise<boolean> {
    const canDelete = await this.repository.canDeleteBook(id);
    if (!canDelete) {
      throw new Error(
        'Não é possível excluir este livro pois ele já possui empréstimos. Se não puder mais realizar empréstimos, atualize sua disponibilidade.',
      );
    }
    return canDelete;
  }

  async hasActiveBorrow(id: number): Promise<boolean> {
    const canBorrow = await this.repository.hasActiveBorrow(id);
    if (!canBorrow) {
      throw new Error(
        'Não é possível emprestar o exemplar deste livro, pois ele possui empréstimos em aberto.',
      );
    }
    return canBorrow;
  }
}
