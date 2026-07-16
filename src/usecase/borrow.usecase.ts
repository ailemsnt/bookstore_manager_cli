import { Emprestimo } from "../domain/emprestimo";
import { EmprestimoRepository } from "../infra/repositories/emprestimo.repository";
import { BorrowDto } from "../view/dto/borrow-list.dto";

export class BorrowUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async findBorrowByStatus(status: number): Promise<Emprestimo[]>  {
    const borrow = await this.repository.findBorrowByStatus(status);
    if (borrow.length === 0) {
      throw new Error("Não foram encontrados empréstimos com a situação informada.");
    }
    return borrow;
  }

  async findBorrowById(id: number): Promise<BorrowDto | null> {
    const borrow = await this.repository.findBorrowById(id);
    if (!borrow) {
      throw new Error("Não foram encontrados empréstimos com o ID informado.");
    }
    return borrow;
  }

  async canBorrowBook(id: number): Promise<boolean> {
    const canBorrow = await this.repository.canBorrowBook(id);
    if (!canBorrow) {
      throw new Error("Não é possível emprestar este livro pois ele não está mais disponível.");
    } 
    return canBorrow;
  }

  async canCancelBorrow(id: number): Promise<boolean> {
    const canCancelBorrow = await this.repository.canCancelBorrow(id);
    if (!canCancelBorrow) {
      throw new Error("Não é possível cancelar este empréstimo pois ele possui livros devolvidos.");
    } 
    return canCancelBorrow;
  }

  async cancelBorrow(id: number): Promise<boolean> {
    const cancelBorrow = await this.repository.cancelBorrow(id);
    if (!cancelBorrow) {
      throw new Error("Não é possível cancelar este empréstimo.");
    } 
    return cancelBorrow;
  }

}