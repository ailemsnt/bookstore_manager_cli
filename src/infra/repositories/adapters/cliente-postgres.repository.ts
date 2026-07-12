import { Pool } from "pg";
import { Cliente } from "../../../domain/customer";
import { ClienteRepository } from "../cliente.repository";

export class ClientePostgresRepository implements ClienteRepository{
  constructor(private readonly pool: Pool) {}

  async findCustomerByName(name: string): Promise<Cliente | null> {
    const { rows } = await this.pool.query(
      `SELECT c.*, m.nome AS municipio_nome, u.sigla as uf_sigla
          FROM cliente c
          INNER JOIN municipio m ON m.id = c.municipio_id
          INNER JOIN uf u on u.id = m.uf_id 
          WHERE (unaccent(c.nome)) ilike (unaccent($1)) AND c.deleted_at is null
          ORDER BY c.nome ASC`,
      [`${name}%`],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findCustomerById(id: number): Promise<Cliente | null> {
    const { rows } = await this.pool.query(
      `SELECT c.*, m.nome AS municipio_nome, u.sigla as uf_sigla
          FROM cliente c
          INNER JOIN municipio m ON m.id = c.municipio_id
          INNER JOIN uf u on u.id = m.uf_id 
          WHERE c.id = $1 AND c.deleted_at is null`,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAllCustomers(): Promise<Cliente[]> {
    const { rows } = await this.pool.query(
      `SELECT c.*, m.nome AS municipio_nome, u.sigla as uf_sigla
          FROM cliente c
          INNER JOIN municipio m ON m.id = c.municipio_id
          INNER JOIN uf u on u.id = m.uf_id 
          WHERE c.deleted_at is null 
          ORDER BY c.id`);
    
    return rows;      
  }

  async createCustomer(customer: Omit<Cliente, "id">): Promise<Cliente> {
    const {
      rows: [row],
    } = await this.pool.query<Cliente>(
      `INSERT INTO cliente (nome, cpf, endereco, cep, numero, bairro, municipio_id, telefone, email, ativo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *`,
      [customer.nome, customer.cpf, customer.endereco, customer.cep, customer.numero, customer.bairro, customer.municipio_id, customer.telefone, customer.email, customer.ativo]
    );

    return row;
  }
  
  async updateCustomer(customer: Cliente): Promise<Cliente> {
    const { rows: [row], } = await this.pool.query<Cliente>(
      `UPDATE cliente SET nome = $1,endereco = $2, cep = $3, numero = $4, bairro = $5, municipio_id = $6, telefone = $7, email = $8, ativo = $9
        WHERE id = $10 AND deleted_at is null RETURNING *`,
      [customer.nome, customer.endereco, customer.cep, customer.numero, customer.bairro, customer.municipio_id, customer.telefone, customer.email, customer.ativo, customer.id],
    );

    return row;
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.pool.query("UPDATE cliente SET deleted_at = NOW() WHERE id = $1", [id]);    
    // if (result.rowCount === 0) {
    //   throw new Error(`Autor com id ${id} não encontrado`);
    // }
  }
}