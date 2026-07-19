import { Autor } from './autor';

export enum EmprestimoStatus {
  TODOS = 0, 
  ABERTO = 1,
  CANCELADO = 2,
  DEVOLVIDO = 3,
  ATRASADO = 4
}
export interface Emprestimo {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  data_emprestimo: Date;
  livros: EmprestimoLivro[];
  canceled_at?: Date;
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
  status: EmprestimoStatus;
  data_devolucao?: Date;
}

export interface EmprestimoRetorno {
  id: number;
  cliente_id: number;
}
