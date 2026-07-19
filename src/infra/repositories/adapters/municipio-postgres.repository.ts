import { Pool } from 'pg';
import { Municipio } from '../../../domain/municipio';
import { MunicipioRepository } from '../municipio.repository';

export class MunicipioPostgresRepository implements MunicipioRepository {
  constructor(private readonly pool: Pool) {}

  async findMunicipalityByName(name: string): Promise<Municipio[]> {
    const { rows } = await this.pool.query(
      `SELECT m.id, m.nome, u.sigla AS uf_sigla
      FROM municipio m
      INNER JOIN uf u ON u.id = m.uf_id
      WHERE unaccent(m.nome) ILIKE unaccent($1)
      ORDER BY m.nome ASC`,
      [`${name}%`],
    );

    if (rows.length === 0) {
      return [];
    }

    return rows;
  }

  async findMunicipalityById(id: number): Promise<Municipio | null> {
    const { rows } = await this.pool.query(
      `SELECT m.id, m.nome, u.sigla AS uf_sigla
      FROM municipio m
      INNER JOIN uf u ON u.id = m.uf_id
      WHERE m.id = $1`,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
