import { Session } from "../infra/database/session";
import { ConsoleView } from "../@common/view/console.view";
import { BorrowUseCase } from "../usecase/borrow.usecase";

const userId = Session.getUserId();

export class BorrowView extends ConsoleView {
  constructor(private readonly borrowUc: BorrowUseCase)
  { 
    super(); 
  }
  
  async start(): Promise<void> {
    await this.update();
  }

  protected async update(){
      while (true) {
        this.display('')
        this.display('________________________________________')
        this.display('                EMPRÉSTIMOS             ')   
        this.display('________________________________________\n')     
        this.display(" Informe o número da opção desejada:");
        this.display(" 1. Buscar empréstimos por Status");        
        this.display(" 2. Buscar empréstimos por Cliente");//ID ou nome do 
        this.display(" 3. Buscar empréstimos por Livro");//Código ou ISBN
        this.display(" 4. Buscar empréstimos por Data de inclusão");
        this.display(" 5. Buscar empréstimos por Data de devolução");
        this.display(" 6. Realizar empréstimo");          
        this.display(" 0. VOLTAR AO MENU PRINCIPAL");
        this.display("________________________________________\n");
      
        const optionSelected = await this.prompt('Opção:');         
  
        switch (optionSelected) {
          case '1':
            this.display('Buscando empréstimos por Status...');

            break;          
  
          case '2':
            this.display('Buscando empréstimos por Cliente...');

            break;
  
          case '3':
            this.display('Buscando empréstimos por livro...');
            
            break;
  
          case '4':
            this.display('Buscando empréstimos por Data de inclusão...');
  
            break;

          case '5':
            this.display('Buscando empréstimos por Data de devolução...');
  
            break;  
          case '6':
            this.display('Iniciando empréstimo...');
  
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