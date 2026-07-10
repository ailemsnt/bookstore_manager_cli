export interface Emprestimo {
  id: number;
  livro_id: number;
  cliente_id: number;
  data_emprestimo: Date;
  data_prevista_devolucao: Date;
  data_devolucao: Date | null;
  devolvido: string; 
}