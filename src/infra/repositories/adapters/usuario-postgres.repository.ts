import { Pool } from "pg";
import { UsuarioRepository } from "../usuario.repository";
import { Usuario } from "../../../domain/usuario";

export class UsuarioPostgresRepository implements UsuarioRepository {
  constructor(private readonly pool: Pool) {}

  async findUserByLogin(login: string): Promise<Usuario | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM usuario WHERE login = $1",
      [login],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async createUser(user: Omit<Usuario, "id">): Promise<Usuario> {
    const {
      rows: [row],
    } = await this.pool.query<Usuario>(
      "INSERT INTO usuario (login, senha, perfil_id) VALUES ($1, $2, $3) RETURNING *",
      [user.login, user.senha, 2],
    );

    return row;
  }

  async updatePassword(userId: number, password: string): Promise<Usuario> {
    const { rows: [row], } = await this.pool.query<Usuario>(
      "UPDATE usuario SET senha = $1 WHERE id = $2 RETURNING *",
      [password, userId],
    );

    return row;
  }
}