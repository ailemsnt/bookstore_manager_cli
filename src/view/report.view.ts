import { ConsoleView } from "../@common/view/console.view";
import { ReportUseCase } from "../usecase/report.usecase";

export class ReportView extends ConsoleView {
  constructor(private readonly reportUc: ReportUseCase)
  { 
    super(); 
  }
  
  async start(): Promise<void> {
    await this.update();
  }

  protected async update(){
      while (true) {
        this.display('')
        this.display('________________________________________');
        this.display('                RELATÓRIOS              ');   
        this.display('________________________________________\n');     
        this.display(" Informe o número da opção desejada:");
        this.display(" 1. Listar livros disponíveis para empréstimo");        
        this.display(" 2. Listar livros emprestados");//ID ou nome do 
        this.display(" 3. Listar livros cadastrados por autor");//Código ou ISBN
        this.display(" 4. Listar quantidade de empréstimos por livro");
        this.display(" 5. Listar clientes com empréstimo ativo");
        this.display(" 6. Listar apenas livros que não podem mais ser emprestados");
        this.display(" 7. Ranking de clientes assíduos");
        this.display(" 8. Ranking de autores mais populares");
        this.display(" 9. .....");          
        this.display(" 0. VOLTAR AO MENU PRINCIPAL");
        this.display("________________________________________\n");
      
        const optionSelected = await this.prompt('Opção:');         
  
        switch (optionSelected) {
          case '1':            
            this.display('\n================================================================================');
            this.display('         RELATÓRIO DE LIVROS DISPONÍVEIS PARA EMPRÉSTIMO   ');  
            this.display('================================================================================');

            const list = await this.reportUc.listAvailableBooks();
            
            let total = 0;
            list.forEach((book) => {
              total++; 

              if (total > 1) {
                this.display('----------------------------------------');  
              }
              const authors = book.autor.map((author) => author.nome).join(', ');
            
              this.display(
                `${book.id} - #${book.codigo}: ${(book.titulo).toUpperCase()}
                Autor(es): ${authors}
                Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}\n`);              
            });
            this.display('================================================================================');
            this.display(`   TOTAL DISPONÍVEL: ${total}`);  
            this.display('================================================================================\n');

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