import { Municipio } from "../../domain/municipio";

export interface MunicipioRepository {
  findCountryByName(name: string): Promise<Municipio[]>;

  findCountryById(id: number): Promise<Municipio | null>;
}
