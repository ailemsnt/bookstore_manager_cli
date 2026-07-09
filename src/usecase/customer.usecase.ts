import { Cliente, ClienteUpdate } from "../domain/customer";
import { ClienteRepository } from "../infra/repositories/cliente.repository";

export class CustomerUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async search(name: string): Promise<Cliente | null> {
    const customer = await this.repository.findCustomerByName(name);
    
    return customer;
  }

  async findCustomerById(id: number): Promise<Cliente> {
    const customer = await this.repository.findCustomerById(id);
    if (!customer) {
      throw new Error("Cliente não encontrado");
    }
    return customer;
  }

  async findAllCustomers(): Promise<Cliente[]> {
    const customers = await this.repository.findAllCustomers();
    if (customers.length === 0) {
      throw new Error("Nenhum livro encontrado");
    }
    return customers;
  }

  async createCustomer(customer: Omit<Cliente, "id">): Promise<Cliente> {
    const newCustomer = await this.repository.createCustomer(customer);
    if (!newCustomer) {
      throw new Error("Erro ao cadastrar o cliente");
    }
    return newCustomer;
  }

  async updateCustomer(customer: ClienteUpdate): Promise<Cliente> {
    const updatedCustomer = await this.repository.updateCustomer(customer);
    if (!updatedCustomer) {
      throw new Error("Erro ao atualizar cliente");
    }
    return updatedCustomer;
  }

  deleteCustomer(id: number): Promise<void> {     
    return this.repository.deleteCustomer(id);    
  }
}