import { Municipio } from '../domain/municipio';
import { MunicipioRepository } from '../infra/repositories/municipio.repository';

export class MunicipalityService {
  constructor(private readonly repository: MunicipioRepository) {}

  async findMunicipalityByName(name: string): Promise<Municipio[]> {
    const municipality = await this.repository.findMunicipalityByName(name);

    return municipality;
  }

  async findMunicipalityById(id: number): Promise<Municipio | null> {
    const municipality = await this.repository.findMunicipalityById(id);
    if (!municipality) {
      throw new Error('Município não encontrado');
    }
    return municipality;
  }
}
