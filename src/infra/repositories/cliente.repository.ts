import { Cliente, ClienteDetalhe, ClienteInput, ClienteUpdate } from "../../domain/customer";
import { CustomerListDto } from "../../view/dto/customer-list.dto";

export interface ClienteRepository {
  findCustomerByName(title: string): Promise<CustomerListDto[]>;
  
  findCustomerById(id: number): Promise<CustomerListDto | null>;

  findCustomerByCpf(name: string): Promise<CustomerListDto |null>;

  findAllCustomers(): Promise<CustomerListDto[]>;

  createCustomer(customer: ClienteInput): Promise<Cliente>;

  updateCustomer(book: ClienteUpdate): Promise<Cliente>;

  deleteCustomer(id: number): Promise<void>;

  canDeleteCustomer(id: number): Promise<boolean>;
}