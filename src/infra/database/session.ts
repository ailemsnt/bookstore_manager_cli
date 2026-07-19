import { Usuario } from '../../domain/usuario';

export class Session {
  static currentUser: Usuario | null = null;

  static getUserId(): number | null {
    return this.currentUser?.id ?? null;
  }

  static isLogged(): boolean {
    return this.currentUser !== null;
  }

  static logout(): void {
    this.currentUser = null;
  }
}
