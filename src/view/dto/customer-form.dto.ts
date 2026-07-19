import { ConsoleFormSchema } from '../../@common/view/console.view';

export class CustomerFormDto {
  constructor(
    public nome: string,
    public cpf: string,
    public endereco: string,
    public numero: string,
    public cep: string,
    public bairro: string,
    public telefone: string,
    public email: string,
    public municipio_id: number
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true, minLength: 3, maxLength: 255 },
      cpf: { type: 'string', required: true },
      endereco: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 100,
      },
      numero: { type: 'string', required: true, maxLength: 10 },
      cep: { type: 'string', required: false, minLength: 8, maxLength: 8 },
      bairro: { type: 'string', required: true, minLength: 5, maxLength: 60 },
      municipio_id: { type: 'number', required: true, minLength:1, maxLength: 10},
      telefone: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 15,
      },
      email: { type: 'string', required: true, minLength: 5, maxLength: 100 },
    };
  }
}

export class CustomerUpdateDto {
  constructor(
    public id: number,
    public nome: string,
    public endereco: string,
    public numero: string,
    public cep: string,
    public bairro: string,
    public municipio_id: number,
    public telefone: string,
    public email: string,
    public ativo: number
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true, minLength: 1 },
      nome: { type: 'string', required: false, minLength: 3, maxLength: 255 },
      endereco: {
        type: 'string',
        required: false,
        minLength: 5,
        maxLength: 100,
      },
      numero: { type: 'string', required: false, maxLength: 10 },
      cep: { type: 'string', required: false, minLength: 8, maxLength: 8 },
      bairro: { type: 'string', required: false, minLength: 5, maxLength: 60 },
      municipio_id: { type: 'number', required: false, minLength: 1 },
      telefone: {
        type: 'string',
        required: false,
        minLength: 10,
        maxLength: 15,
      },
      email: { type: 'string', required: false, minLength: 5, maxLength: 100 },
      ativo: { type: 'number', required: false, minLength: 1, maxLength: 1}
    };
  }
}
