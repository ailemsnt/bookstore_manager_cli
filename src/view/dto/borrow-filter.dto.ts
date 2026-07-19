import { EmprestimoStatus } from "../../domain/emprestimo";

export class BorrowFilterDto {
  constructor(
    public status?: EmprestimoStatus,
    public clienteId?: number,
    public livroId?: number,
    public dataInicio?: Date,
    public dataFim?: Date,
  ) {}
}
