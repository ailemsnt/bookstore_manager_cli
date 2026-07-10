import { ConsoleFormSchema } from "../../@common/view/console.view";

export class BorrowFormDto {
  constructor(   
    public id: number,
    public livro_id: number,
    public cliente_id: number,
  ) {}
  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true },
      livro_id: { type: 'number', required: true },
      cliente_id: { type: 'number', required: true },
    };
  }
}