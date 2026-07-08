import { Autor } from "../domain/autor";
import { AutorRepository } from "../infra/repositories/autor.repository";

export class AuthorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async search(name: string): Promise<Autor | null> {
    const author = await this.repository.findAuthorByName(name);
    
    return author;
  }

  async findAuthorById(id: number): Promise<Autor> {
    const author = await this.repository.findAuthorById(id);
    if (!author) {
      throw new Error("Autor não encontrado");
    }
    return author;
  }

  async findAllAuthors(): Promise<Autor[]> {
    const authors = await this.repository.findAllAuthors();
    if (authors.length === 0) {
      throw new Error("Nenhum autor encontrado");
    }
    return authors;
  }
  
  async createAuthor(author: Omit<Autor, "id">): Promise<Autor> {
    const newAuthor = await this.repository.createAuthor(author);
    if (!newAuthor) {
      throw new Error("Erro ao criar autor");
    }
    return newAuthor;
  }

  async updateAuthor(id: number, nome: string): Promise<Autor> {
    const updatedAuthor = await this.repository.updateAuthor(id, nome);
    if (!updatedAuthor) {
      throw new Error("Erro ao atualizar autor");
    }
    return updatedAuthor;
  }

  deleteAuthor(id: number): Promise<void> {     
    return this.repository.deleteAuthor(id);    
  }
}