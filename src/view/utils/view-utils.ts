import { getCurrentDate } from "../../@common/utils/common.utils";

export function getStatusBorrowBook(dueAt: Date, returnedAt?: Date, canceledBorrowAt?: Date): string {
  const currentDate = getCurrentDate();
  currentDate.setHours(0, 0, 0, 0);

  const expectedReturnDate = new Date(dueAt);
  expectedReturnDate.setHours(0, 0, 0, 0);

  if (canceledBorrowAt) {   
    return `**Empréstimo CANCELADO!**`
  }

  if (returnedAt) {
    const returnDate = new Date(returnedAt);
    returnDate.setHours(0, 0, 0, 0);

    const overdueDays = Math.floor(
    (returnDate.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24));

    return (overdueDays > 0
    ? `*Devolvido com ${overdueDays} dia(s) de atraso*`
    : 'Devolvido em dia');
  }

  const overdueDays = Math.floor(
    (currentDate.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (overdueDays > 0
    ? `**Em atraso há ${overdueDays} dia(s)**`
    : 'Em dia');
}