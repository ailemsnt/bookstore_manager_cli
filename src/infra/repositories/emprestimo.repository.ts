import { Emprestimo, EmprestimoRetorno } from '../../domain/emprestimo';
import { BorrowFilterDto } from '../../view/dto/borrow-filter.dto';
import { BorrowFormDto } from '../../view/dto/borrow-form.dto';
import { BorrowDto } from '../../view/dto/borrow-list.dto';
export interface EmprestimoRepository {
  findBorrowFilter(filters: BorrowFilterDto): Promise<Emprestimo[]>;

  findBorrowById(id: number): Promise<BorrowDto | null>;

  canBorrowBook(id: number): Promise<boolean>;

  canCancelBorrow(id: number): Promise<boolean>;

  cancelBorrow(id: number): Promise<boolean>;

  canReturnBorrow(id: number): Promise<boolean>;

  createBorrow(
    borrow: BorrowFormDto,
    livrosId: number[],
    userId: number,
  ): Promise<EmprestimoRetorno | null>;

  returnBorrow(id: number): Promise<boolean>; 
}
