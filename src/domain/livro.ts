import { Autor } from "./autor";

export interface Livro {
  id: number;
  titulo: string;
  autor_id: number; 
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  disponivel: number;
  isbn: string;
}