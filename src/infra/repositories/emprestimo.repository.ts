import { Emprestimo } from "../../domain/emprestimo";
import { BorrowDto } from "../../view/dto/borrow-list.dto";

export interface EmprestimoRepository {
  /*findBorrowByCostumerId(costumerId: number): Promise<Emprestimo | null>;

  findBorrowByCostumerName(costumerName: string): Promise<Emprestimo | null>;
    
  findBorrowByBookId(bookId: number): Promise<Emprestimo | null>;

  findBorrowByBookCodeOrIsbn(codeOrIsbn: string): Promise<Emprestimo | null>;

  findABorrowByBorrowDate(borrowDate: string): Promise<Emprestimo | null>;

  findABorrowByReturnDate(returnDate: string): Promise<Emprestimo | null>;

  findABorrowByExpireDate(expireDate: string): Promise<Emprestimo | null>;*/

  findBorrowByStatus(status: number): Promise<Emprestimo[]>;
  
  findBorrowById(id: number): Promise<BorrowDto | null>;

  canBorrowBook(id: number): Promise<boolean>;

  canCancelBorrow(id: number): Promise<boolean>;

  cancelBorrow(id: number): Promise<boolean>;

 // createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo>;
}