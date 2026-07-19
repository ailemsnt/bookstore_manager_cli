import {
  Cliente,
} from '../domain/customer';
import { ClienteRepository } from '../infra/repositories/cliente.repository';
import { CustomerFormDto, CustomerUpdateDto } from '../view/dto/customer-form.dto';
import { CustomerListDto } from '../view/dto/customer-list.dto';

export class CustomerService {
  constructor(private readonly repository: ClienteRepository) {}

  async search(name: string): Promise<CustomerListDto[]> {
    const customer = await this.repository.findCustomerByName(name);

    if (!customer) {
      throw new Error('Nenhum cliente encontrado');
    }
    return customer;
  }

  async findCustomerById(id: number): Promise<CustomerListDto> {
    const customer = await this.repository.findCustomerById(id);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }
    return customer;
  }

  async findCustomerByCpf(cpf: string): Promise<CustomerListDto | null> {
    const customer = await this.repository.findCustomerByCpf(cpf);
    if (customer) {
      throw new Error('Cliente já cadastrado');
    }
    return customer;
  }

  async findAllCustomers(): Promise<CustomerListDto[]> {
    const customers = await this.repository.findAllCustomers();
    if (customers.length === 0) {
      throw new Error('Nenhum cliente encontrado');
    }
    return customers;
  }

  async createCustomer(customer: CustomerFormDto): Promise<Cliente> {
    const newCustomer = await this.repository.createCustomer(customer);
    if (!newCustomer) {
      throw new Error('Erro ao cadastrar o cliente');
    }
    return newCustomer;
  }

  async isCustomerActiveOrDeleted(id: number): Promise<CustomerListDto | null>{
    const customer = await this.repository.isCustomerActiveOrDeleted(id);
    if (!customer) {
      throw new Error('Cliente não encontrado.');
    }

    if (!customer.ativo) {
      throw new Error('Cliente está inativo e não pode realizar empréstimos.');
    }
    return customer;
  }

  async updateCustomer(customer: CustomerUpdateDto): Promise<Cliente> {
    const updatedCustomer = await this.repository.updateCustomer(customer);
    if (!updatedCustomer) {
      throw new Error('Erro ao atualizar cliente');
    }
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const costumerDeleted = this.repository.deleteCustomer(id);
    if (!costumerDeleted) {
      throw new Error('Erro ao excluir o cliente');
    }
    return costumerDeleted;
  }

  async canDeleteCustomer(id: number): Promise<boolean> {
    const canDelete = await this.repository.canDeleteCustomer(id);
    if (!canDelete) {
      throw new Error(
        'Não é possível excluir este cliente pois ele já possui empréstimos. Você apenas poderá inativá-lo, atualizando os dados.',
      );
    }
    return canDelete;
  }
}
