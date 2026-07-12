import { Cliente, ClienteDetalhe, ClienteInput, ClienteUpdate } from "../../domain/customer";

export interface ClienteRepository {
  findCustomerByName(title: string): Promise<Cliente | null>;
  
  findCustomerById(id: number): Promise<ClienteDetalhe | null>;

  findAllCustomers(): Promise<ClienteDetalhe[]>;

  createCustomer(customer: ClienteInput): Promise<Cliente>;

  updateCustomer(book: ClienteUpdate): Promise<Cliente>;

  deleteCustomer(id: number): Promise<void>;
}