import { ConsoleFormSchema } from '../../@common/view/console.view';

export class BorrowFormDto {
  constructor(public cliente_id: number) {}
  
  static schema(): ConsoleFormSchema {
    return {
      cliente_id: { type: 'number', required: true },
    };
  }
}
