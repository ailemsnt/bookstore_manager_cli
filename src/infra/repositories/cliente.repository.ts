import {
  Cliente,
  ClienteUpdate,
} from '../../domain/customer';
import { CustomerFormDto, CustomerUpdateDto } from '../../view/dto/customer-form.dto';
import { CustomerListDto } from '../../view/dto/customer-list.dto';

export interface ClienteRepository {
  findCustomerByName(title: string): Promise<CustomerListDto[]>;

  findCustomerById(id: number): Promise<CustomerListDto | null>;

  findCustomerByCpf(name: string): Promise<CustomerListDto | null>;

  findAllCustomers(): Promise<CustomerListDto[]>;

  createCustomer(customer: CustomerFormDto): Promise<Cliente>;

  updateCustomer(book: CustomerUpdateDto): Promise<Cliente>;

  deleteCustomer(id: number): Promise<boolean>;

  canDeleteCustomer(id: number): Promise<boolean>;

  isCustomerActiveOrDeleted(id: number): Promise<CustomerListDto | null>;
}
