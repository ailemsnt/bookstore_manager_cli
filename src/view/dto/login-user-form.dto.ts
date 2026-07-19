import { ConsoleFormSchema } from '../../@common/view/console.view';

export class LoginUserDto {
  constructor(
    public login: string,
    public senha: string,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      login: { type: 'string', required: true },
      senha: { type: 'string', required: true, hidden: true, minLength: 6 },
    };
  }
}
