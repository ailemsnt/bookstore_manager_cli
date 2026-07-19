export class MunicipalityListDto {
  constructor(
    public id: number,
    public nome: string,
    public uf: UfListDto,
  ) {}
}

export class UfListDto {
  constructor(
    public id: number,
    public uf_sigla: string,
  ) {}
}
