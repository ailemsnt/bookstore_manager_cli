import { Emprestimo } from "../domain/emprestimo";
import { EmprestimoRepository } from "../infra/repositories/emprestimo.repository";

export class BorrowUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async findABorrowByStatus(status: number): Promise<Emprestimo[]>  {
    const borrow = await this.repository.findABorrowByStatus(status);
    if (borrow.length === 0) {
      throw new Error("Não foram encontrados empréstimos com a situação informada.");
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

/* async findBorrowByCostumerId(costumerId: number): Promise<Emprestimo | null> {
    const borrow = await this.repository.findBorrowByCostumerId(costumerId);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para o ID do cliente informado.");
    }
    return borrow;
  }

  async findBorrowByCostumerName(costumerName: string): Promise<Emprestimo | null> {
    const borrow = await this.repository.findBorrowByCostumerName(costumerName);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para o cliente informado.");
    }
    return borrow;
  }

  async findBorrowByBookId(bookId: number): Promise<Emprestimo | null> {
    const borrow = await this.repository.findBorrowByBookId(bookId);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para o ID do livro informado.");
    }
    return borrow;
  }

  async findBorrowByBookCodeOrIsbn(codeOrIsbn: string): Promise<Emprestimo | null> {
    const borrow = await this.repository.findBorrowByBookCodeOrIsbn(codeOrIsbn);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para os códigos de livro informado.");
    }
    return borrow;
  } 

  async findABorrowByBorrowDate(borrowDate: string): Promise<Emprestimo | null> {
    const borrow = await this.repository.findABorrowByBorrowDate(borrowDate);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para a data de empréstimo informada.");
    }
    return borrow;
  }  

  async findABorrowByReturnDate(returnDate: string): Promise<Emprestimo | null> {
    const borrow = await this.repository.findABorrowByReturnDate(returnDate);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para a data de devolução informada.");
    }
    return borrow;
  } 

  async findABorrowByExpireDate(expireDate: string): Promise<Emprestimo | null> {
    const borrow = await this.repository.findABorrowByExpireDate(expireDate);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para a data prevista de devolução informada.");
    }
    return borrow;
  } 
  
  async findABorrowByStatus(status: number): Promise<Emprestimo | null> {
    const borrow = await this.repository.findABorrowByStatus(status);
    if (!borrow) {
      throw new Error("Empréstimos não encontrados para a data prevista de devolução informada.");
    }
    return borrow;
  } 
  
  async createBorrow(borrow: Omit<Emprestimo, "id">, userId: number): Promise<Emprestimo>{
    const newBorrow = await this.repository.createBorrow(borrow, userId);
    if (!newBorrow) {
      throw new Error("Erro ao cadastrar o empréstimo.");
    }
    return newBorrow;
  } */
}