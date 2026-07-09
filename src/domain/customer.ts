export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  cep: string;
  numero: string;
  bairro: string;
  municipio_id: number;
  telefone: string;
  email: string;
  ativo: number;
}

export interface ClienteUpdate {
  id: number
  nome: string;  
  endereco: string;
  cep: string;
  numero: string;
  bairro: string;
  municipio_id: number;
  telefone: string;
  email: string;
  ativo: number;
}