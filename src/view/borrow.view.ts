import { Session } from "../infra/database/session";
import { ConsoleView } from "../@common/view/console.view";
import { BorrowUseCase } from "../usecase/borrow.usecase";
import { formatDate, maskCpf } from "../@common/utils/common.utils";
import { BookUseCase } from "../usecase/book.usecase";
import { CustomerUseCase } from "../usecase/customer.usecase";
import { BorrowFilterDto } from "./dto/borrow-filter.dto";
import { BorrowFormDto } from "./dto/borrow-form.dto";

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
      this.display('____________________________________________________________');
      this.display('');
      books.forEach((b) => {
        this.display(`#${b.id} - Cod. int.:${b.codigo} • ISBN ${b.isbn}
Título: ${(b.titulo).toUpperCase()}`);
      });
      this.display('');

      while (true) {
        const bookId = await this.prompt('\nInforme o ID do livro exibido na lista acima: ');
        
        const bookIdValidate = Number(bookId);
        if (Number.isNaN(bookIdValidate)) {
          this.display('ID do livro informado inválido.\n');
          continue;
        } 

        const bookExists = await this.bookUc.findBookById(bookIdValidate);
        if (!bookExists) {            
          continue;
        } 

        this.display(`Livro selecionado: #${bookExists.id} - ${bookExists.codigo} - ${bookExists.titulo}\n`);

        return bookIdValidate;
      }
    } 
  }

  private async selectCustomer(): Promise<number> {
    while (true) {
      const customerNamePartial = await this.prompt('Informe o nome do cliente: (ao menos 3 letras) ');

      const customers = await this.customerUc.search(customerNamePartial);

      if (customers.length === 0) {
        this.display('Cliente não encontrado.');
        continue;
      }

      this.display('Clientes encontrados:');      
      this.display('____________________________________________________________');
      customers.forEach((customer) => {
        this.display(`#${customer.id} - ${(customer.nome).toUpperCase()} • CPF: ${maskCpf(customer.cpf)}`);
      });
      this.display('');

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

        this.display(`Cliente selecionado: #${customerExists.id} - ${customerExists.nome} - ${maskCpf(customerExists.cpf)}`);

        return customerIdValidate;
      }
    } 
  }

  protected async update(){
    const userId = Session.getUserId();
    const filter = new BorrowFilterDto();  
      while (true) {
        this.display('')
        this.display('____________________________________________________________')
        this.display('                EMPRÉSTIMOS             ')   
        this.display('____________________________________________________________\n')     
        this.display(" Informe o número da opção desejada:");
        this.display(" 1. Listar empréstimos em aberto");        
        this.display(" 2. Buscar empréstimos");//Livro ou cliente       
        this.display(" 3. Realizar empréstimo");          
        this.display(" 4. Cancelar empréstimo"); 
        this.display(" 5. Registrar devolução");   
        this.display(" 0. VOLTAR AO MENU PRINCIPAL");
        this.display("____________________________________________________________\n");
      
        const optionSelected = await this.prompt('Opção: ');  
  
        switch (optionSelected) {
          case '1':
            this.display('Listando empréstimos em aberto...');

            filter.status = 1;  
            const listBorrowOpened = await this.borrowUc.findBorrowFilter(filter);

            listBorrowOpened.forEach((borrow) => {
              this.display(
`------------------------------------
Empréstimo ID: #${borrow.id} Data empréstimo: ${formatDate(borrow.data_emprestimo)}
Cliente: #${borrow.cliente_id}: ${(borrow.cliente_nome).toUpperCase()}

Livro(s) aguardando devolução:`);

              borrow.livros.forEach((livro) => {
                this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} 
Status: ${livro.status}\n`)
              });
            }); 
            this.display("____________________________________________________________\n");           
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
                this.display('\nPesquisando por Empréstimo...');

                const id = await this.prompt('Informe o ID do empréstimo: ');          
                const borrowById = await this.borrowUc.findBorrowById(Number(id));               

                if (!borrowById) {
                  return;
                }
              
                this.display(
`------------------------------------
Empréstimo ID: #${borrowById.id} Data empréstimo: ${formatDate(borrowById.data_emprestimo)}
Cliente: #${borrowById.cliente_id}: ${(borrowById.cliente_nome).toUpperCase()}

Livro(s):`);
                borrowById.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}
Status: ${livro.status}\n`)
                });                 
                this.display("____________________________________________________________\n");
                break;
              case '2':
                this.display('\nPesquisando por livro...');

                const bookId = await this.selectBook();

                if (!bookId) {
                  return;
                }                

                filter.livroId = Number(bookId);  
                const borrowByBookId = await this.borrowUc.findBorrowFilter(filter);                

                if (!borrowByBookId) {
                  return;
                }

                borrowByBookId.forEach((borrow) => {
                  this.display(
`------------------------------------
Empréstimo ID: #${borrow.id} Data empréstimo: ${formatDate(borrow.data_emprestimo)}
Cliente: #${borrow.cliente_id}: ${(borrow.cliente_nome).toUpperCase()}

Livro(s):`);
                  borrow.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}
Status: ${livro.status}\n`)
                  });
                });
                this.display("____________________________________________________________\n");
                break;
              case '3':
                this.display('\nPesquisando por cliente...');

                const customerId = await this.selectCustomer();

                if (!customerId) {
                  return;
                }                

                filter.clienteId = Number(customerId);  
                const borrowByCustomerId = await this.borrowUc.findBorrowFilter(filter);                

                if (!borrowByCustomerId) {
                  return;
                }

                borrowByCustomerId.forEach((borrow) => {
                  this.display(
`------------------------------------
Empréstimo ID: #${borrow.id} Data empréstimo: ${formatDate(borrow.data_emprestimo)}
Cliente: #${borrow.cliente_id}: ${(borrow.cliente_nome).toUpperCase()}

Livro(s):`);
                  borrow.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Status: ${livro.status}\n`)
                  });
                });
                this.display("____________________________________________________________\n");                
                break;  
              default:  
                this.display('Opção inválida. Por favor, selecione uma opção válida.');
                break;  
            }
            
            break;  
            
          case '3':
            this.display('Cadastrando empréstimo...');
            const borrowDto = await this.promptInteractiveForm('Informe os dados do empréstimo: ',BorrowFormDto.schema(), BorrowFormDto);
            
            const booksId: number[] = [];

            while (true) {
              const bookId = await this.prompt('Informe o ID do livro: ');
              const bookIdValidate = Number(bookId);
              if (Number.isNaN(bookIdValidate)) {
                this.display('ID do livro informado inválido.');
                continue;
              } 
  
              const bookExists = await this.bookUc.findBookById(bookIdValidate);
              if (!bookExists) {            
                continue;
              }
              
              const canBorrowBook = await this.borrowUc.canBorrowBook(bookIdValidate);
              if (!canBorrowBook) {
                return
              }

              booksId.push(bookIdValidate);
              this.display(`Livro ${(bookExists.titulo).toUpperCase()} adicionado ao empréstimo.`);             

              if (booksId.length === 5) {
                this.display(`Atingido a quantidade máxima de livros por empréstimo.`);
                break;
              }

              const confirmationAddBook = await this.confirmAction('adicionar novo livro para este empréstimo','Continuando...');
              if (!confirmationAddBook) {
                break;
              }    
            }
  
            // const borrowOrError = await this.borrowUc
            // .search(borrowDto.id)
            // .catch((error: unknown) => error as Error)
  
            // if (bookOrError instanceof Error) {
            //   this.reportTechnicalError(bookOrError)
            //   await this.prompt('Pressione ENTER para sair...')
            //   return
            // }
            
            // if (bookOrError) {
            //   this.display(`Livro já cadastrado!`);
            //   return
            // }
            
            if (booksId.length === 0) {
              this.display('O empréstimo deve possuir ao menos um livro!');
              return
            }
  
            const confirmationCreate = await this.confirmAction('gravar o empréstimo','Operação cancelada pelo usuário.');
            if (!confirmationCreate) {
              return;
            }
            
            const borrowCreated = await this.borrowUc.createBorrow({ cliente_id: Number(borrowDto.cliente_id)}, booksId, Number(userId));
  
            if (!borrowCreated) {
              break;
            }
  
            this.display(`\nEmpréstimo cadastrado com sucesso!`);          
  
            break; 
          
          case '4':
            this.display('Cancelamento de empréstimo...'); 

            this.display('\nPesquisando por Empréstimo...');

                const id = await this.prompt('Informe o ID do empréstimo: ');          
                const borrowById = await this.borrowUc.findBorrowById(Number(id));               

                if (!borrowById) {
                  return;
                }
              
                this.display(
`------------------------------------
Empréstimo ID: #${borrowById.id} Data empréstimo: ${formatDate(borrowById.data_emprestimo)}
Cliente: #${borrowById.cliente_id}: ${(borrowById.cliente_nome).toUpperCase()}

Livro(s):`);
                borrowById.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}
Status: ${livro.status}\n`)
                });                 
                this.display("____________________________________________________________\n");
  
              const canCancelBorrow = await this.borrowUc.canCancelBorrow(borrowById.id);
              if (!canCancelBorrow) {
                break;  
              }

              const confirmationCancelBorrow = await this.confirmAction('cancelar todo o empréstimo, mesmo sendo ação irreversível','Operação cancelada pelo usuário.');
              if (!confirmationCancelBorrow) {
                break;
              } 

              const borrowCanceled = await this.borrowUc.cancelBorrow(borrowById.id);
              
              if (!borrowCanceled) {
                break;
              }
              
              this.display(`\nEmpréstimo cancelado com sucesso!`); 

            break; 

          case '5':
            this.display('Registrando devolução...');  

            this.display('\nPesquisando por Empréstimo...');

                const returnId = await this.prompt('Informe o ID do empréstimo: ');          
                const returnById = await this.borrowUc.findBorrowById(Number(returnId));               

                if (!returnById) {
                  return;
                }
              
                this.display(
`------------------------------------
Empréstimo ID: #${returnById.id} Data empréstimo: ${formatDate(returnById.data_emprestimo)}
Cliente: #${returnById.cliente_id}: ${(returnById.cliente_nome).toUpperCase()}

Livro(s):`);
                returnById.livros.forEach((livro) => {
                  this.display(
`#${livro.id} - ${livro.codigo}: ${(livro.titulo).toUpperCase()}
Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}
Editora: ${livro.editora} • ${livro.edicao} • ${livro.ano_publicacao} • ISBN: ${livro.isbn} 
Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}
Status: ${livro.status}\n`)
                });                 
                this.display("____________________________________________________________\n");
  
              const canReturnBorrow = await this.borrowUc.canReturnBorrow(returnById.id);
              if (!canReturnBorrow) {
                break;  
              }

              this.display(`\nATENÇÃO! Confira os livros recebidos antes de finalizar a devolução!`);  
              const confirmationReturnBorrow = await this.confirmAction('devolver todos os livros deste empréstimo','Operação cancelada pelo usuário.');
              if (!confirmationReturnBorrow) {
                break;
              } 

              const borrowReturned = await this.borrowUc.cancelBorrow(returnById.id);
              
              if (!borrowReturned) {
                break;
              }
              
              this.display(`\nDevolução dos livros realizada com sucesso!`);   
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