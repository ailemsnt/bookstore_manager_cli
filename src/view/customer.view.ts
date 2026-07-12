import { formatInChar, formatOutChar, maskCpf } from "../@common/utils/common.utils";
import { ConsoleView } from "../@common/view/console.view";
import { CountryUseCase } from "../usecase/country.usecase";
import { CustomerUseCase } from "../usecase/customer.usecase";
import { CustomerFormDto, CustomerUpdateDto } from "./dto/customer-form.dto";

export class CustomerView extends ConsoleView {
  constructor(private readonly customerUc: CustomerUseCase, private readonly countryUc: CountryUseCase)
  { 
    super(); 
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async selectCountry(): Promise<number> {
    while (true) {
      const countryNamePartial = await this.prompt('Informe o nome do município: (ao menos 3 letras) ');

      const countries = await this.countryUc.findCountryByName(countryNamePartial);

      if (countries.length === 0) {
        this.display('Município não encontrado.');
        continue;
      }

      this.display('Municípios disponíveis:');

      countries.forEach((m) => {
        this.display(`${m.id} - ${m.nome} - ${m.uf_sigla}`);
      });
      
      while (true) {
        const countryId = await this.prompt('Informe o ID do município exibido na lista acima: ');
        
        const countryIdValidate = Number(countryId);
        if (Number.isNaN(countryIdValidate)) {
          this.display('ID do município informado inválido.');
          continue;
        } 

        const countryExists = await this.countryUc.findCountryById(countryIdValidate);
        if (!countryExists) {            
          continue;
        } 

        this.display(`Município selecionado: ${countryExists.nome} - ${countryExists.uf_sigla}`);

        return countryIdValidate ;
      }
    } 
  }

  protected async update(){
    while (true) {
      this.display('')
      this.display('________________________________________')
      this.display('                CLIENTES                ')   
      this.display('________________________________________\n')     
      this.display(" Informe o número da opção desejada:");
      this.display(" 1. Listar todos os clientes");
      this.display(" 2. Buscar cliente por ID");
      this.display(" 3. Cadastrar cliente");
      this.display(" 4. Atualizar cliente");
      this.display(" 5. Excluir cliente");    
      this.display(" 0. VOLTAR AO MENU PRINCIPAL");
      this.display("________________________________________\n");
    
      const optionSelected = await this.prompt('Opção:');         

      switch (optionSelected) {
        case '1':
          this.display('Listando clientes...');
          
          const list = await this.customerUc.findAllCustomers();

          list.forEach((customer) => {
            this.display(
            `#${customer.id} - ${(customer.nome).toUpperCase()} • CPF: ${maskCpf(customer.cpf)}
            Endereço: ${customer.endereco}, ${customer.numero}, ${customer.bairro} - ${customer.municipio} - ${customer.uf} • ${customer.cep}
            Contatos: ${customer.telefone} •  ${customer.email}
            Ativo: ${formatOutChar(customer.ativo)}`);         
          });
          break;          

        case '2':
          this.display('Buscando cliente por ID...');

          const id = await this.prompt('Informe o ID do cliente:');          
          const customer = await this.customerUc.findCustomerById(Number(id));          

          this.display(
            `#${customer.id} - ${(customer.nome).toUpperCase()} • CPF: ${maskCpf(customer.cpf)}
            Endereço: ${customer.endereco}, ${customer.numero}, ${customer.bairro} - ${customer.municipio} - ${customer.uf} • ${customer.cep}
            Contatos: ${customer.telefone} •  ${customer.email}
            Ativo: ${formatOutChar(customer.ativo)}`);
          break;

          case '3':                  
            this.display('Cadastrando cliente...');
            const customerDto = await this.promptInteractiveForm('Informe os dados do cliente',CustomerFormDto.schema(), CustomerFormDto);
          
            const countryIdCostumer = await this.selectCountry();

            const customerOrError = await this.customerUc
            .search(customerDto.nome)
            .catch((error: unknown) => error as Error)

            if (customerOrError instanceof Error) {
              this.reportTechnicalError(customerOrError)
              await this.prompt('Pressione ENTER para sair...')
              return
            }
            
            if (customerOrError) {
              this.display(`Cliente já cadastrado!`);
              return
            }
            
            const customerCreated = await this.customerUc.createCustomer({ nome: customerDto.nome, cpf: customerDto.cpf, endereco: customerDto.endereco, cep: customerDto.cep, numero: customerDto.numero,  bairro: customerDto.bairro, municipio_id: Number(countryIdCostumer), telefone: customerDto.telefone, email: customerDto.email, ativo: formatInChar(customerDto.ativo)});

            this.display(`Cliente cadastrado com sucesso! Nome: ${customerCreated.nome}, CPF: ${maskCpf(customerCreated.cpf)}`);
          break;

        case '4':
          this.display('Atualizando cliente...');
          
          const idUpdate = await this.prompt('Informe o ID do livro a ser atualizado:'); 
          await this.customerUc.findCustomerById(Number(idUpdate));  

          const customerUpdateDto = await this.promptInteractiveForm('Informe os dados do livro',CustomerUpdateDto.schema(), CustomerUpdateDto);

          const customerUpdateOrError = await this.customerUc
          .search(customerUpdateDto.nome)
          .catch((error: unknown) => error as Error)

          if (customerUpdateOrError instanceof Error) {
            this.reportTechnicalError(customerUpdateDto)
            await this.prompt('Pressione ENTER para sair...')
            return
          }
        
          const customerUpdated = await this.customerUc.updateCustomer( {id: Number(idUpdate), nome: customerUpdateDto.nome, endereco: customerUpdateDto.endereco, cep: customerUpdateDto.cep, numero: customerUpdateDto.numero,  bairro: customerUpdateDto.bairro, municipio_id: Number(customerUpdateDto.municipio_id), telefone: customerUpdateDto.telefone, email: customerUpdateDto.email, ativo: formatInChar(customerUpdateDto.ativo)});           

          this.display(`Livro atualizado com sucesso! ID: ${customerUpdated.id}, Título: ${customerUpdated.nome}`);
          break;

        case '5':
          this.display('Excluindo cliente...');

          const idDelete = await this.prompt('Informe o ID do cliente a ser excluído:');          
          await this.customerUc.findCustomerById(Number(idDelete)); 

          //TODO: fazer validação se não foi utilizado ?
          await this.customerUc.deleteCustomer(Number(idDelete));
          this.display('Cliente excluído com sucesso!');
          break;

        case '0': 
          this.display('Voltando ao menu principal...');              
          return
        default:
          this.display('Opção inválida. Por favor, selecione uma opção válida.');
          break;
      }
    }
  }
}