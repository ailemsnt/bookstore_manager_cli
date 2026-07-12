export interface Municipio {
  id: number;
  nome: string;
  uf_id: Uf;
}

export interface Uf {
  id: number;
  nome: string;
  sigla: string;
}