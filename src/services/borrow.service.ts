import { Emprestimo, EmprestimoRetorno } from '../domain/emprestimo';
import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository';
import { BorrowFilterDto } from '../view/dto/borrow-filter.dto';
import { BorrowFormDto } from '../view/dto/borrow-form.dto';
import { BorrowDto } from '../view/dto/borrow-list.dto';

export class BorrowService {
  constructor(private readonly repository: EmprestimoRepository) {}

  async findBorrowFilter(filters: BorrowFilterDto): Promise<Emprestimo[]> {
    const borrow = await this.repository.findBorrowFilter(filters);
    if (borrow.length === 0) {
      throw new Error(
        'Não foram encontrados empréstimos para a busca informada.',
      );
    }
    return borrow;
  }

  async findBorrowById(id: number): Promise<BorrowDto | null> {
    const borrow = await this.repository.findBorrowById(id);
    if (!borrow) {
      throw new Error('Não foram encontrados empréstimos com o ID informado.');
    }
    return borrow;
  }

  async canBorrowBook(id: number): Promise<boolean> {
    const canBorrow = await this.repository.canBorrowBook(id);
  
    return canBorrow;
  }

  async canCancelBorrow(id: number): Promise<boolean> {
    const canCancelBorrow = await this.repository.canCancelBorrow(id);
    if (!canCancelBorrow) {
      throw new Error(
        'Não é possível cancelar este empréstimo pois ele possui livros devolvidos.',
      );
    }
    return canCancelBorrow;
  }

  async cancelBorrow(id: number): Promise<boolean> {
    const cancelBorrow = await this.repository.cancelBorrow(id);
    if (!cancelBorrow) {
      throw new Error(
        'Não é possível cancelar este empréstimo. Verifique se não existe devolução realizada.',
      );
    }
    return cancelBorrow;
  }

  async canReturnBorrow(id: number): Promise<boolean> {
    const canReturnBorrow = await this.repository.canReturnBorrow(id);
    
    return canReturnBorrow;
  }

  async createBorrow(
    borrow: BorrowFormDto,
    livrosId: number[],
    userId: number,
  ): Promise<EmprestimoRetorno | null> {
    const newBorrow = await this.repository.createBorrow(
      borrow,
      livrosId,
      userId,
    );
    if (!newBorrow) {
      throw new Error('Não foi possível cadastrar o empréstimo.');
    }
    return newBorrow;
  }

  async returnBorrow(id: number): Promise<boolean>{
    const returnBorrow = await this.repository.returnBorrow(id);
    if (!returnBorrow) {
      throw new Error(
        'Não foi possível realizar a devolução dos livros.',
      );
    }
    return returnBorrow;
  } 
}
