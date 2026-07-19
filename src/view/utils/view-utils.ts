import { getCurrentDate } from '../../@common/utils/common.utils';
import { EmprestimoStatus } from '../../domain/emprestimo';

export function getStatusBorrowBook(
  dueAt: Date,
  returnedAt?: Date,
  canceledBorrowAt?: Date,
): EmprestimoStatus {
  if (canceledBorrowAt) {
    return EmprestimoStatus.CANCELADO;
  }

  if (returnedAt) {  
    return EmprestimoStatus.DEVOLVIDO;
  }
  const currentDate = getCurrentDate();
  currentDate.setHours(0, 0, 0, 0);

  const expectedReturnDate = new Date(dueAt);
  expectedReturnDate.setHours(0, 0, 0, 0);

  if (expectedReturnDate < currentDate) {
    return EmprestimoStatus.ATRASADO;
  }

  return EmprestimoStatus.ABERTO;  
}

export function cleanCpf(cpf: string): number {
  return Number(cpf.replace(/\D/g, ''));
}

export function getBorrowStatusDescription(
  status?: EmprestimoStatus,
): string {
  switch (status) {
    case EmprestimoStatus.ABERTO:
      return 'Aberto';

    case EmprestimoStatus.CANCELADO:
      return 'CANCELADO';

    case EmprestimoStatus.DEVOLVIDO:
      return 'Devolvido';

    case EmprestimoStatus.ATRASADO:
      return '*ATRASADO*';

    default:
      return 'Não informado';
  }
}