export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  edicao: string;
  ano_publicacao: number;
  codigo: string;
  disponivel: number;
  isbn: string;
}
export interface LivroUpdate {
  id: number;
  titulo: string; 
  editora: string;
  edicao: string;
  ano_publicacao: number;
  disponivel: number; 
}