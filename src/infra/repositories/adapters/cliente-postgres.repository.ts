import { ClienteUpdate } from './../../../domain/customer';
import { Pool } from 'pg';
import { Cliente } from '../../../domain/customer';
import { ClienteRepository } from '../cliente.repository';
import { CustomerListDto } from '../../../view/dto/customer-list.dto';
import { CustomerFormDto, CustomerUpdateDto } from '../../../view/dto/customer-form.dto';

const sqlSelect = `SELECT c.id, c.nome, c.cpf, c.endereco,
            c.numero, c.bairro, c.cep, c.telefone,
            c.email, c.ativo, c.data_cadastro,
            m.id AS municipio_id, m.nome AS municipio_nome,
            u.id AS uf_id, u.sigla AS uf_sigla
          FROM cliente c
          INNER JOIN municipio m ON m.id = c.municipio_id
          INNER JOIN uf u on u.id = m.uf_id `;
export class ClientePostgresRepository implements ClienteRepository {
  constructor(private readonly pool: Pool) {}

  async findCustomerByName(name: string): Promise<CustomerListDto[]> {
    const result = await this.pool.query(
      `${sqlSelect} 
          WHERE (unaccent(c.nome)) ilike (unaccent($1)) AND (c.deleted_at is null)
          ORDER BY c.nome ASC`,
      [`${name}%`],
    );

    if (result.rowCount === 0) {
      return [];
    }

    const customers = result.rows.map((row): CustomerListDto => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      endereco: row.endereco,
      numero: row.numero,
      bairro: row.bairro,
      cep: row.cep,
      telefone: row.telefone,
      email: row.email,
      ativo: row.ativo,
      data_cadastro: row.data_cadastro,
      municipio: {
        id: row.municipio_id,
        nome: row.municipio_nome,
        uf: {
          id: row.uf_id,
          uf_sigla: row.uf_sigla,
        },
      },
    }));

    return customers;
  }

  async findCustomerById(id: number): Promise<CustomerListDto | null> {
    const result = await this.pool.query(
      `${sqlSelect} 
          WHERE c.id = $1 AND c.deleted_at is null`,
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      endereco: row.endereco,
      numero: row.numero,
      bairro: row.bairro,
      cep: row.cep,
      telefone: row.telefone,
      email: row.email,
      ativo: row.ativo,
      data_cadastro: row.data_cadastro,
      municipio: {
        id: row.municipio_id,
        nome: row.municipio_nome,
        uf: {
          id: row.uf_id,
          uf_sigla: row.uf_sigla,
        },
      },
    };
  }

  async findCustomerByCpf(cpf: string): Promise<CustomerListDto | null> {
    const result = await this.pool.query(
      `${sqlSelect} 
          WHERE c.cpf = $1 AND c.deleted_at is null`,
      [cpf],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      endereco: row.endereco,
      numero: row.numero,
      bairro: row.bairro,
      cep: row.cep,
      telefone: row.telefone,
      email: row.email,
      ativo: row.ativo,
      data_cadastro: row.data_cadastro,
      municipio: {
        id: row.municipio_id,
        nome: row.municipio_nome,
        uf: {
          id: row.uf_id,
          uf_sigla: row.uf_sigla,
        },
      },
    };
  }

  async findAllCustomers(): Promise<CustomerListDto[]> {
    const result = await this.pool.query(
      `${sqlSelect} 
          WHERE c.deleted_at is null 
          ORDER BY c.nome ASC`,
    );

    if (result.rowCount === 0) {
      return [];
    }

    const customers = result.rows.map((row): CustomerListDto => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      endereco: row.endereco,
      numero: row.numero,
      bairro: row.bairro,
      cep: row.cep,
      telefone: row.telefone,
      email: row.email,
      ativo: row.ativo,
      data_cadastro: row.data_cadastro,
      municipio: {
        id: row.municipio_id,
        nome: row.municipio_nome,
        uf: {
          id: row.uf_id,
          uf_sigla: row.uf_sigla,
        },
      },
    }));

    return customers;
  }

  async createCustomer(customer: CustomerFormDto): Promise<Cliente> {
    const {
      rows: [row],
    } = await this.pool.query<Cliente>(
      `INSERT INTO cliente (nome, cpf, endereco, cep, numero, bairro, municipio_id, telefone, email) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
      [
        customer.nome,
        customer.cpf,
        customer.endereco,
        customer.cep,
        customer.numero,
        customer.bairro,
        customer.municipio_id,
        customer.telefone,
        customer.email,
      ],
    );

    return row;
  }

  async isCustomerActiveOrDeleted(id: number): Promise<CustomerListDto | null> {
    const result = await this.pool.query(
      `SELECT ativo
      FROM cliente
      WHERE id = $1
        AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      endereco: row.endereco,
      numero: row.numero,
      bairro: row.bairro,
      cep: row.cep,
      telefone: row.telefone,
      email: row.email,
      ativo: row.ativo,
      data_cadastro: row.data_cadastro,
      municipio: {
        id: row.municipio_id,
        nome: row.municipio_nome,
        uf: {
          id: row.uf_id,
          uf_sigla: row.uf_sigla,
        },
      },
    };

  }

  async updateCustomer(customer: CustomerUpdateDto): Promise<Cliente> {
    const {
      rows: [row],
    } = await this.pool.query<Cliente>(
      `UPDATE cliente 
        SET 
            nome = COALESCE(NULLIF($1, ''), nome),
            endereco = COALESCE(NULLIF($2, ''), endereco),
            cep = COALESCE(NULLIF($3, ''), cep),
            numero = COALESCE(NULLIF($4, ''), numero),
            bairro = COALESCE(NULLIF($5, ''), bairro),
            municipio_id = COALESCE($6, municipio_id),
            telefone = COALESCE(NULLIF($7, ''), telefone),
            email = COALESCE(NULLIF($8, ''), email),
            ativo = COALESCE($9, ativo)

        WHERE id = $10 
        AND deleted_at IS NULL

        RETURNING *`,
      [
        customer.nome,
        customer.endereco,
        customer.cep,
        customer.numero,
        customer.bairro,
        customer.municipio_id,
        customer.telefone,
        customer.email,
        customer.ativo,
        customer.id,
      ],
    );

    return row;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'UPDATE cliente SET deleted_at = NOW() WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async canDeleteCustomer(id: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT NOT EXISTS(
      SELECT 1
      FROM cliente c
      LEFT JOIN emprestimo e ON e.cliente_id = c.id
      WHERE c.id = $1 AND (c.deleted_at IS NOT NULL OR c.ativo <> 1 OR e.id IS NOT NULL)) AS can_delete`,
      [id],
    );

    return rows[0].can_delete;
  }
}
