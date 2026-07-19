import {
  formatInChar,
  formatOutChar,
  maskCpf,
} from '../@common/utils/common.utils';
import { ConsoleView } from '../@common/view/console.view';
import { CustomerService } from '../services/customer.service';
import { MunicipalityService } from '../services/municipality.service';
import { CustomerFormDto, CustomerUpdateDto } from './dto/customer-form.dto';
import { cleanCpf } from './utils/view-utils';

export class CustomerView extends ConsoleView {
  constructor(
    private readonly customerSrv: CustomerService,
    private readonly municipalitySrv: MunicipalityService,
  ) {
    super();
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async selectMunicipality(idMunicipality: number): Promise<number | null> {   
    const municipalityIdValidate = Number(idMunicipality);
    if (Number.isNaN(municipalityIdValidate)) {
      this.display('ID do município informado inválido.');
      return null;
    }

    const municipalityExists =
      await this.municipalitySrv.findMunicipalityById(
        municipalityIdValidate,
      );
    
    if (!municipalityExists) {
      this.display('Município não encontrado.');      
      return null;
    }

    this.display(
      `Município selecionado: ${municipalityExists.nome} - ${municipalityExists.uf_sigla}`,
    );

    return municipalityIdValidate;    
  }

  private async findAllCustomers(): Promise<void> {
    this.display('Listando clientes...');

    const list = await this.customerSrv.findAllCustomers();

    list.forEach((customer) => {
      this.display(
        `#${String(customer.id)} - ${customer.nome.toUpperCase()} • CPF: ${maskCpf(customer.cpf)}`,
      );
      this.display(
        `Endereço: ${customer.endereco}, ${customer.numero}, ${customer.bairro} - ${customer.municipio.nome} - ${customer.municipio.uf.uf_sigla} • ${customer.cep}`,
      );
      this.display(`Contatos: ${customer.telefone} •  ${customer.email}`);
      this.display(`Ativo: ${formatOutChar(customer.ativo)}\n`);
    });
    this.display(' ');
  }

  private async findCustomerById(): Promise<void> {
    this.display('Buscando cliente por ID...');

    const id = await this.prompt('Informe o ID do cliente:');
    const customer = await this.customerSrv.findCustomerById(Number(id));

    this.display(
      `#${customer.id} - ${customer.nome.toUpperCase()} • CPF: ${maskCpf(customer.cpf)}`,
    );
    this.display(
      `Endereço: ${customer.endereco}, ${customer.numero}, ${customer.bairro} - ${customer.municipio.nome} - ${customer.municipio.uf.uf_sigla} • ${customer.cep}`,
    );
    this.display(`Contatos: ${customer.telefone} •  ${customer.email}`);
    this.display(`Ativo: ${formatOutChar(customer.ativo)}`);
  }

  private async createCustomer(): Promise<void> {
    this.display('Cadastrando cliente...');
    const customerDto = await this.promptInteractiveForm(
      'Informe os dados do cliente',
      CustomerFormDto.schema(),
      CustomerFormDto,
    );
    
    const customerExists = await this.customerSrv.findCustomerByCpf(customerDto.cpf);
    if (customerExists) {
      this.display(`Cliente já cadastrado!`);
      return;
    }
    
    const municipalityIdExists = await this.selectMunicipality(customerDto.municipio_id);    

    if (!municipalityIdExists) {
      return;
    }

    const customerOrError = await this.customerSrv
      .findCustomerByCpf(customerDto.cpf)
      .catch((error: unknown) => error as Error);

    if (customerOrError instanceof Error) {
      this.reportTechnicalError(customerOrError);
      await this.prompt('Pressione ENTER para sair...');
      return;
    }

    const customerCreated = await this.customerSrv.createCustomer({
      nome: customerDto.nome,
      cpf: customerDto.cpf,
      endereco: customerDto.endereco,
      cep: customerDto.cep,
      numero: customerDto.numero,
      bairro: customerDto.bairro,
      municipio_id: customerDto.municipio_id,
      telefone: customerDto.telefone,
      email: customerDto.email,
    });

    this.display(
      `Cliente cadastrado com sucesso! Nome: ${customerCreated.nome} • CPF:  ${maskCpf(customerCreated.cpf)}`,
    );
  }

  private async updateCustomer(): Promise<void> {
    this.display('Atualizando cliente...');

    const idUpdate = await this.prompt(
      'Informe o ID do cliente a ser atualizado:',
    );
    const customerFound = await this.customerSrv.findCustomerById(Number(idUpdate));

    if (!customerFound) {
      return;
    }

    const customerActive = await this.customerSrv.isCustomerActiveOrDeleted(Number(idUpdate));

    if (!customerActive) {
      return;
    }

    const customerUpdateDto = await this.promptInteractiveForm(
      'Informe os dados do cliente a serem alterados: ',
      CustomerUpdateDto.schema(),
      CustomerUpdateDto,
    );

    const municipalityIdExists = await this.selectMunicipality(customerUpdateDto.municipio_id);    

    if (!municipalityIdExists) {
      return;
    }

    const customerUpdateOrError = await this.customerSrv
      .search(customerUpdateDto.nome)
      .catch((error: unknown) => error as Error);

    if (customerUpdateOrError instanceof Error) {
      this.reportTechnicalError(customerUpdateDto);
      await this.prompt('Pressione ENTER para sair...');
      return;
    }

    const customerUpdated = await this.customerSrv.updateCustomer({
      id: Number(idUpdate),
      nome: customerUpdateDto.nome,
      endereco: customerUpdateDto.endereco,
      cep: customerUpdateDto.cep,
      numero: customerUpdateDto.numero,
      bairro: customerUpdateDto.bairro,
      municipio_id: customerUpdateDto.municipio_id,
      telefone: customerUpdateDto.telefone,
      email: customerUpdateDto.email,
      ativo: customerUpdateDto.ativo
    });

    this.display(
      `Cliente alterado com sucesso! Nome: ${customerUpdated.nome} • CPF:  ${maskCpf(customerUpdated.cpf)}`,
    );
  }

  private async deleteCustomer(): Promise<void> {
    this.display('Excluindo cliente...');

    const idDelete = await this.prompt(
      'Informe o ID do cliente a ser excluído:',
    );
    const customerDelete = await this.customerSrv.findCustomerById(
      Number(idDelete),
    );

    const canDelete = await this.customerSrv.canDeleteCustomer(
      Number(idDelete),
    );
    if (!canDelete) {
      return;
    }

    const customerActive = await this.customerSrv.isCustomerActiveOrDeleted(Number(idDelete));

    if (!customerActive) {
      return;
    }

    const confirmationDeleteCustomer = await this.confirmAction(
      `excluir o cliente #${String(customerDelete.id)} - ${customerDelete.nome}  • CPF:  ${maskCpf(customerDelete.cpf)}`,
      'Operação cancelada pelo usuário',
    );
    if (!confirmationDeleteCustomer) {
      return;
    }

    await this.customerSrv.deleteCustomer(Number(idDelete));
    this.display('Cliente excluído com sucesso!');
  }

  protected async update() {
    while (true) {
      this.display('');
      this.display(
        '____________________________________________________________',
      );
      this.display(
        '                          CLIENTES                          ',
      );
      this.display(
        '____________________________________________________________\n',
      );
      this.display(' Informe o número da opção desejada:');
      this.display(' 1. Listar todos os clientes');
      this.display(' 2. Buscar cliente por ID');
      this.display(' 3. Cadastrar cliente');
      this.display(' 4. Atualizar cliente');
      this.display(' 5. Excluir cliente');
      this.display(' 0. VOLTAR AO MENU PRINCIPAL');
      this.display(
        '____________________________________________________________\n',
      );

      const optionSelected = await this.prompt('Opção:');

      switch (optionSelected) {
        case '1':
          await this.findAllCustomers();
          break;

        case '2':
          await this.findCustomerById();
          break;

        case '3':
          await this.createCustomer();
          break;

        case '4':
          await this.updateCustomer();
          break;

        case '5':
          await this.deleteCustomer();
          break;

        case '0':
          this.display('Voltando ao menu principal...');
          return;
        default:
          this.display(
            'Opção inválida. Por favor, selecione uma opção válida.',
          );
          break;
      }
    }
  }
}
