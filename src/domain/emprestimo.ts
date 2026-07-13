import { Autor } from "./autor";

export interface Emprestimo {
  id: number; 
  cliente_id: number;
  cliente_nome: string;
  data_emprestimo: Date;
  livros: EmprestimoLivro[]; 
}
export interface EmprestimoLivro {
  id: number;
  codigo: string;
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  isbn: string;
  data_prevista_devolucao: Date;
  autores: Autor[];
  status: string;
}