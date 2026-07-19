import { MunicipalityListDto } from './municipality-list.dto';
export class CustomerListDto {
  constructor(
    public id: number,
    public nome: string,
    public cpf: string,
    public endereco: string,
    public numero: string,
    public bairro: string,
    public cep: string,
    public telefone: string,
    public email: string,
    public ativo: number,
    public municipio: MunicipalityListDto,
    public data_cadastro?: Date,
  ) {}
}
