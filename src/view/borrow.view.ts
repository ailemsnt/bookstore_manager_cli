import { Session } from "../infra/database/session";
import { ConsoleView } from "../@common/view/console.view";
import { BorrowUseCase } from "../usecase/borrow.usecase";
import { formatDate } from "../@common/utils/common.utils";
import { BookUseCase } from "../usecase/book.usecase";

const userId = Session.getUserId();

export class BorrowView extends ConsoleView {
  constructor(private readonly borrowUc: BorrowUseCase, private readonly bookUc: BookUseCase )
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
        this.display(" 1. Listar empréstimos em aberto");        
        this.display(" 2. Buscar empréstimos");//Livro ou cliente       
        this.display(" 3. Realizar empréstimo");          
        this.display(" 4. Cancelar empréstimo"); 
        this.display(" 5. Registrar devolução");   
        this.display(" 0. VOLTAR AO MENU PRINCIPAL");
        this.display("________________________________________\n");
      
        const optionSelected = await this.prompt('Opção: ');         
  
        switch (optionSelected) {
          case '1':
            this.display('Listando empréstimos em aberto...');

            const listBorrowOpened = await this.borrowUc.findBorrowByStatus(1);

            listBorrowOpened.forEach((borrow) => {
              this.display(
`------------------------------------
Cliente: #${borrow.cliente_id}: ${(borrow.cliente_nome).toUpperCase()}
Data empréstimo: ${formatDate(borrow.data_emprestimo)}

Livro(s) aguardando devolução:
              `);

              borrow.livros.forEach((livro) => {
                this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Status: ${livro.status}\n`)
              });
            });            
            break;          
  
          case '2':
            this.display('Buscando empréstimos...');
            this.display(" Informe o número da opção desejada:");
            this.display(" 1. Pesquisar por ID do empréstimo"); 
            this.display(" 2. Pesquisar por Título do livro (informe ao menos 3 letras)"); 
            this.display(" 3. Pesquisar por Código ou CPF do cliente");
            
            const optionSelected = await this.prompt('Opção: '); 

            switch (optionSelected) {
              case '1':
                this.display('Buscando por ID...');

                const id = await this.prompt('Informe o ID do empréstimo: ');          
                const borrowById = await this.borrowUc.findBorrowById(Number(id));               

                if (!borrowById) {
                  return;
                }
              
                  this.display(
`------------------------------------
Cliente: #${borrowById.cliente_id}: ${(borrowById.cliente_nome).toUpperCase()}
Data empréstimo: ${formatDate(borrowById.data_emprestimo)}

Livro(s) aguardando devolução:
              `);

                borrowById.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Status: ${livro.status}\n`)
                  });                 

                break;
              case '2':
                this.display('Buscando por título...');
                // const bookTitle = await this.prompt('Informe o título do livro a ser pesquisado: ');          
                // const book = await this.bookUc.search(bookTitle); 


                

                break;
              case '3':
                this.display('cliente...');
                break;  
              default:  
                this.display('Opção inválida. Por favor, selecione uma opção válida.');
                break;  
            }
            
            break;  
            
          case '3':
            this.display('Cadastrando empréstimo...');
            
  
            break; 
          
          case '4':
            this.display('Cancelamento de empréstimo...'); 
            
  
            break; 

          case '5':
            this.display('Registrando devolução...');  
  
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