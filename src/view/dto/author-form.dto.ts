import { ConsoleFormSchema } from '../../@common/view/console.view';

export class AuthorFormDto {
  constructor(public nome: string) {}
  
  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true, minLength: 4 },
    };
  }
}
