import { Autor } from './autor';

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  baixado: number;
  isbn: string;
  autores: Autor[];
}
export interface LivroInput {
  id?: number;
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  baixado: number;
  isbn: string;
  autores: number[];
}
export interface LivroUpdate {
  id?: number;
  titulo: string;
  editora: string;
  edicao: string;
  baixado: number;
  ano_publicacao: number;
  autores: number[];
}

export type LivroCreate = Omit<Livro, 'id'>;
