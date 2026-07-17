export class BorrowFilterDto {
  constructor (
    public status?: number,
    public clienteId?: number,
    public livroId?: number,
    public dataInicio?: Date,
    public dataFim?: Date,
  ) {}
}