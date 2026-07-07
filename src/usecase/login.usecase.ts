import { UsuarioRepository } from "../infra/repositories/usuario.repository";

export class LoginUseCase {
  constructor(private readonly repository: UsuarioRepository) {}
  
  async search(login: string, senha: string): Promise<boolean> {
    const user = await this.repository.findUserByLogin(login);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    
    return user.senha === senha;
  }
}