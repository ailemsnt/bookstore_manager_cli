import { ConsoleFormSchema } from "../../@common/view/console.view";

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
    public ativo: string
  ) {}

  static schema(): ConsoleFormSchema {
      return {
        nome: { type: 'string', required: true, minLength: 3, maxLenght: 255 },
        cpf: { type: 'string', required: true },
        endereco: { type: 'string', required: true, minLength: 5, maxLenght: 100 },
        numero: { type: 'string', required: true, maxLenght: 10 },
        cep: { type: 'string', required: false, minLength: 8, maxLenght: 8 },
        bairro: { type: 'string', required: true, minLength: 5, maxLenght: 60},
        telefone: { type: 'string', required: true, minLength: 10, maxLenght: 15},
        email: { type: 'string', required: true, minLength: 5, maxLenght: 100 },
        ativo: { type: 'string', required: true, minLength: 1, maxLenght: 1}
      };
    }
}

export class CustomerUpdateDto {
  constructor(
    public nome: string,    
    public endereco: string,
    public numero: string,
    public cep: string,
    public bairro: string,
    public municipio_id: number,
    public telefone: string,
    public email: string,
    public ativo: string
  ) {}

  static schema(): ConsoleFormSchema {
      return {
        nome: { type: 'string', required: false, minLength: 3, maxLenght: 255 },
        endereco: { type: 'string', required: false, minLength: 5, maxLenght: 100 },
        numero: { type: 'string', required: false, maxLenght: 10 },
        cep: { type: 'string', required: false, minLength: 8, maxLenght: 8 },
        bairro: { type: 'string', required: false, minLength: 5, maxLenght: 60},
        municipio_id: { type: 'number', required: false, minLength: 1},
        telefone: { type: 'string', required: false, minLength: 10, maxLenght: 15},
        email: { type: 'string', required: false, minLength: 5, maxLenght: 100 },
        ativo: { type: 'string', required: false, minLength: 1, maxLenght: 1}
      };
    }
}