import { Usuario } from '../domain/usuario';
import { UsuarioRepository } from '../infra/repositories/usuario.repository';

export class LoginService {
  constructor(private readonly repository: UsuarioRepository) {}

  async search(login: string, senha: string): Promise<Usuario> {
    const user = await this.repository.findUserByLogin(login);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.senha !== senha) {
      throw new Error('Usuário ou senha inválidos.');
    }

    return user;
  }
}
