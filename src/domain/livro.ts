import { Autor } from "./autor";

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  disponivel: number;
  isbn: string;
  autor: Autor[];
}
export interface LivroUpdate {
  id: number;
  titulo: string; 
  editora: string;
  edicao: string;
  ano_publicacao: number;
  disponivel: number; 
  autor: Autor[];
}

export interface LivroInput {
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  disponivel: number;
  isbn: string;
  autores: number[];
}

export type LivroCreate = Omit<Livro, "id">;