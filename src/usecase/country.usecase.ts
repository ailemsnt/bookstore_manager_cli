import { Municipio } from "../domain/municipio";
import { MunicipioRepository } from "../infra/repositories/municipio.repository";

export class CountryUseCase {
  constructor(private readonly repository: MunicipioRepository) {}
  
  async findCountryByName(name: string): Promise<Municipio[]> {
    const country = await this.repository.findCountryByName(name);
    
    return country;
  }

  async findCountryById(id: number): Promise<Municipio | null>  {
    const country = await this.repository.findCountryById(id);
    if (!country) {
      throw new Error("Município não encontrado");
    }
    return country;
  }
}