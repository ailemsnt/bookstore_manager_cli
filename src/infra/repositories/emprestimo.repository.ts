import { Emprestimo } from "../../domain/emprestimo";
import { BorrowDto } from "../../view/dto/borrow-list.dto";

export interface EmprestimoRepository {

  findBorrowByStatus(status: number): Promise<Emprestimo[]>;
  
  findBorrowById(id: number): Promise<BorrowDto | null>;

  canBorrowBook(id: number): Promise<boolean>;

  canCancelBorrow(id: number): Promise<boolean>;

  cancelBorrow(id: number): Promise<boolean>;

 // createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo>;
}