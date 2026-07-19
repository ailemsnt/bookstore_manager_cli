import { Autor } from '../domain/autor';
import { AutorRepository } from '../infra/repositories/autor.repository';

export class AuthorService {
  constructor(private readonly repository: AutorRepository) {}

  async search(name: string): Promise<Autor | null> {
    const author = await this.repository.findAuthorByName(name);

    return author;
  }

  async findAuthorById(id: number): Promise<Autor> {
    const author = await this.repository.findAuthorById(id);
    if (!author) {
      throw new Error('Autor não encontrado');
    }
    return author;
  }

  async findAllAuthors(): Promise<Autor[]> {
    const authors = await this.repository.findAllAuthors();
    if (authors.length === 0) {
      throw new Error('Nenhum autor encontrado');
    }
    return authors;
  }

  async createAuthor(author: Omit<Autor, 'id'>): Promise<Autor> {
    const newAuthor = await this.repository.createAuthor(author);
    if (!newAuthor) {
      throw new Error('Erro ao cadastrar o autor');
    }
    return newAuthor;
  }

  async updateAuthor(id: number, name: string): Promise<Autor> {
    const updatedAuthor = await this.repository.updateAuthor(id, name);
    if (!updatedAuthor) {
      throw new Error('Erro ao atualizar autor');
    }
    return updatedAuthor;
  }

  async canDeleteAuthor(id: number): Promise<boolean> {
    const canDelete = await this.repository.canDeleteAuthor(id);
    if (!canDelete) {
      throw new Error(
        'Não é possível excluir este autor pois ele possui livros cadastrados em seu nome.',
      );
    }
    return canDelete;
  }

  async deleteAuthor(id: number): Promise<boolean> {
    const authorDeleted = await this.repository.deleteAuthor(id);
    if (!authorDeleted) {
      throw new Error(
        'Erro ao excluir o autor.',
      );
    }
    return authorDeleted;
  }
}
