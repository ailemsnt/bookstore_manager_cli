import { Cliente, ClienteUpdate } from "../../domain/customer";

export interface ClienteRepository {
  findCustomerByName(title: string): Promise<Cliente | null>;
  
  findCustomerById(id: number): Promise<Cliente | null>;

  findAllCustomers(): Promise<Cliente[]>;

  createCustomer(book: Omit<Cliente, "id">): Promise<Cliente>;

  updateCustomer(book: ClienteUpdate): Promise<Cliente>;

  deleteCustomer(id: number): Promise<void>;
}