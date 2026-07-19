import { Autor } from '../../domain/autor';

export interface AutorRepository {
  findAuthorByName(name: string): Promise<Autor | null>;

  findAuthorById(id: number): Promise<Autor | null>;

  findAllAuthors(): Promise<Autor[]>;

  createAuthor(author: Omit<Autor, 'id'>): Promise<Autor>;

  updateAuthor(id: number, name: string): Promise<Autor>;

  deleteAuthor(id: number): Promise<boolean>;

  canDeleteAuthor(id: number): Promise<boolean>;
}
