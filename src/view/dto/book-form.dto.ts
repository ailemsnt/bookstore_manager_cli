import { ConsoleFormSchema } from '../../@common/view/console.view';

export class BookFormDto {
  constructor(
    public titulo: string,
    public editora: string,
    public edicao: string,
    public ano_publicacao: number,
    public baixado: string,
    public codigo: string,
    public isbn: string,
  ) {}
  
  static schema(): ConsoleFormSchema {
    return {
      titulo: { type: 'string', required: true, minLength: 1 },
      editora: { type: 'string', required: true, minLength: 1 },
      edicao: { type: 'string', required: false, minLength: 3 },
      ano_publicacao: { type: 'number', required: true },
      baixado: { type: 'string', required: true, minLength: 1, maxLength: 1 },
      codigo: { type: 'string', required: true, minLength: 1 },
      isbn: { type: 'string', required: true, minLength: 1 },
    };
  }
}
export class BookUpdateDto {
  constructor(
    public titulo: string,
    public editora: string,
    public edicao: string,
    public ano_publicacao: number,
    public baixado: string,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      titulo: { type: 'string', required: false, minLength: 1 },
      editora: { type: 'string', required: false, minLength: 1 },
      edicao: { type: 'string', required: false, minLength: 3 },
      ano_publicacao: { type: 'number', required: false },
      baixado: { type: 'string', required: false, minLength: 1, maxLength: 1 },
    };
  }
}
