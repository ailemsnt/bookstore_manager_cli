import { Session } from "../infra/database/session";
import { ConsoleView } from "../@common/view/console.view";
import { BorrowUseCase } from "../usecase/borrow.usecase";
import { formatDate } from "../@common/utils/common.utils";
import { BookUseCase } from "../usecase/book.usecase";
import { CustomerUseCase } from "../usecase/customer.usecase";

const userId = Session.getUserId();

export class BorrowView extends ConsoleView {
  constructor(private readonly borrowUc: BorrowUseCase, private readonly bookUc: BookUseCase, private readonly customerUc: CustomerUseCase )
  { 
    super(); 
  }
  
  async start(): Promise<void> {
    await this.update();
  }

  private async selectBook(): Promise<number> {
    while (true) {
      const bookTitlePartial = await this.prompt('Informe o título do livro: (ao menos 3 letras) ');

      const books = await this.bookUc.search(bookTitlePartial);

      if (!books) {
        this.display('Livro não encontrado.');
        continue;
      }

      this.display('Livros encontrados:');
      this.display('ID     | Código interno  | Título');

      books.forEach((b) => {
        this.display(`#${b.id} | ${b.codigo} | ${b.titulo}`);
      });
      
      while (true) {
        const bookId = await this.prompt('Informe o ID do livro exibido na lista acima: ');
        
        const bookIdValidate = Number(bookId);
        if (Number.isNaN(bookIdValidate)) {
          this.display('ID do livro informado inválido.');
          continue;
        } 

        const bookExists = await this.bookUc.findBookById(bookIdValidate);
        if (!bookExists) {            
          continue;
        } 

        this.display(`Livro selecionado: #${bookExists.id} - ${bookExists.codigo} - ${bookExists.titulo}`);

        return bookIdValidate;
      }
    } 
  }

  private async selectCustomer(): Promise<number> {
    while (true) {
      const customerNamePartial = await this.prompt('Informe o nome do cliente: (ao menos 3 letras) ');

      const customers = await this.customerUc.search(customerNamePartial);

      if (!customers) {
        this.display('Cliente não encontrado.');
        continue;
      }

      this.display('Clientes encontrados:');
      this.display('Código     | Nome');

      customers.forEach((customer) => {
        this.display(`#${customer.id} | ${customer.nome} | ${customer.cpf}`);
      });
      
      while (true) {
        const customerId = await this.prompt('Informe o ID do cliente exibido na lista acima: ');
        
        const customerIdValidate = Number(customerId);
        if (Number.isNaN(customerIdValidate)) {
          this.display('ID do livro informado inválido.');
          continue;
        } 

        const customerExists = await this.customerUc.findCustomerById(customerIdValidate);
        if (!customerExists) {            
          continue;
        } 

        this.display(`Cliente selecionado: #${customerExists.id} - ${customerExists.nome} - ${customerExists.cpf}`);

        return customerIdValidate;
      }
    } 
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
            this.display(" 1. Pesquisar por Empréstimo"); 
            this.display(" 2. Pesquisar por Livro"); 
            this.display(" 3. Pesquisar por Cliente");
            
            const optionSelected = await this.prompt('Opção: '); 

            switch (optionSelected) {
              case '1':
                this.display('Buscando por Empréstimo...');

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

                
                const bookId = await this.selectBook();

                

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