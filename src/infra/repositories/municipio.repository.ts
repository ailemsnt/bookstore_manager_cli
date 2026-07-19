import { Municipio } from '../../domain/municipio';

export interface MunicipioRepository {
  findMunicipalityByName(name: string): Promise<Municipio[]>;

  findMunicipalityById(id: number): Promise<Municipio | null>;
}
