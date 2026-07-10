import { Emprestimo } from "../../domain/emprestimo";

export interface EmprestimoRepository {
  findBorrowByCostumerId(costumerId: number): Promise<Emprestimo | null>;

  findBorrowByCostumerName(costumerName: string): Promise<Emprestimo | null>;
    
  findBorrowByBookId(bookId: number): Promise<Emprestimo | null>;

  findBorrowByBookCodeOrIsbn(codeOrIsbn: string): Promise<Emprestimo | null>;

  findABorrowByBorrowDate(borrowDate: string): Promise<Emprestimo | null>;

  findABorrowByReturnDate(returnDate: string): Promise<Emprestimo | null>;

  findABorrowByExpireDate(expireDate: string): Promise<Emprestimo | null>;

  findABorrowByStatus(status: string): Promise<Emprestimo | null>;

  createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo>;
}