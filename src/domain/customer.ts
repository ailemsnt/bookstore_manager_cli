export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  numero: string;
  bairro: string;
  municipio_id: number;
  cep: string;
  telefone: string;
  email: string;
  ativo?: number;
  data_cadastro: Date;
}

export interface ClienteUpdate {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  numero: string;
  bairro: string;
  municipio_id: number;
  municipio_nome?: string;
  uf_sigla?: string;
  telefone: string;
  email: string;
  ativo: number;
}
export interface ClienteDetalhe extends Cliente {
  municipio: string;
  uf: string;
}

export type ClienteCreate = Omit<Cliente, 'id'>;
