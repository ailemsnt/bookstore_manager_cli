import { formatDate, maskCpf } from '../@common/utils/common.utils';
import { Session } from '../infra/database/session';
import { BookService } from '../services/book.service';
import { BorrowService } from '../services/borrow.service';
import { CustomerService } from '../services/customer.service';
import { BorrowFilterDto } from './dto/borrow-filter.dto';
import { BorrowFormDto } from './dto/borrow-form.dto';
import { ConsoleView } from '../@common/view/console.view';
import { BorrowDto } from './dto/borrow-list.dto';
import { getBorrowStatusDescription } from './utils/view-utils';

export class BorrowView extends ConsoleView {
  private readonly filter = new BorrowFilterDto();

  constructor(
    private readonly borrowSrv: BorrowService,
    private readonly bookSrv: BookService,
    private readonly customerSrv: CustomerService,
  ) {
    super();
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async selectBook(): Promise<number> {
    while (true) {
      const bookTitlePartial = await this.prompt(
        'Informe o título do livro: (ao menos 3 letras) ',
      );

      const books = await this.bookSrv.search(bookTitlePartial);

      if (!books) {
        this.display('Livro não encontrado.');
        continue;
      }

      this.display('Livros encontrados:');
      this.display(
        '____________________________________________________________',
      );
      this.display('');
      books.forEach((b) => {
        this.display(`#${String(b.id)} - Cod. int.:${b.codigo} • ISBN ${b.isbn}`);
        this.display(`Título: ${b.titulo.toUpperCase()}`);
      });
      this.display('');

      while (true) {
        const bookId = await this.prompt(
          '\nInforme o ID do livro exibido na lista acima: ',
        );

        const bookIdValidate = Number(bookId);
        if (Number.isNaN(bookIdValidate)) {
          this.display('ID do livro informado inválido.\n');
          continue;
        }

        const bookExists = await this.bookSrv.findBookById(bookIdValidate);
        if (!bookExists) {
          continue;
        }

        this.display(
          `Livro selecionado: #${String(bookExists.id)} - ${bookExists.codigo} - ${bookExists.titulo}\n`,
        );

        return bookIdValidate;
      }
    }
  }

  private async selectCustomer(): Promise<number> {
    while (true) {
      const customerNamePartial = await this.prompt(
        'Informe o nome do cliente: (ao menos 3 letras) ',
      );

      const customers = await this.customerSrv.search(customerNamePartial);

      if (customers.length === 0) {
        this.display('Cliente não encontrado.');
        continue;
      }

      this.display('Clientes encontrados:');
      this.display(
        '____________________________________________________________',
      );
      customers.forEach((customer) => {
        this.display(
          `#${String(customer.id)} - ${customer.nome.toUpperCase()} • CPF: ${maskCpf(customer.cpf)}`,
        );
      });
      this.display('');

      while (true) {
        const customerId = await this.prompt(
          'Informe o ID do cliente exibido na lista acima: ',
        );

        const customerIdValidate = Number(customerId);
        if (Number.isNaN(customerIdValidate)) {
          this.display('ID do livro informado inválido.');
          continue;
        }

        const customerExists =
          await this.customerSrv.findCustomerById(customerIdValidate);
        if (!customerExists) {
          continue;
        }

        this.display(
          `Cliente selecionado: #${customerExists.id} - ${customerExists.nome} - ${maskCpf(customerExists.cpf)}`,
        );

        return customerIdValidate;
      }
    }
  }

  private async findBorrowById(): Promise<void> {
    this.display('\nPesquisando por Empréstimo...');

    const id = await this.prompt('Informe o ID do empréstimo: ');
    const borrowById = await this.borrowSrv.findBorrowById(Number(id));

    if (!borrowById) {
      return;
    }

    this.display('');
    this.display(
      `Empréstimo ID: #${borrowById.id} Data empréstimo: ${formatDate(borrowById.data_emprestimo)}`,
    );
    this.display(
      `Cliente: #${borrowById.cliente_id}: ${borrowById.cliente_nome.toUpperCase()}\n`,
    );
    this.display(`Livro(s):`);
    borrowById.livros.forEach((livro) => {
      this.display(
        `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
      );
      this.display(
        `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
      );
      this.display(
        `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn}`,
      );
      this.display(
        `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}`,
      );
      this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
    });
    this.display('');
  }

  private async findBorrowBybook(): Promise<void> {
    this.display('\nPesquisando por livro...');

    const bookId = await this.selectBook();

    if (!bookId) {
      return;
    }

    this.filter.livroId = Number(bookId);
    const borrowByBookId = await this.borrowSrv.findBorrowFilter(this.filter);

    if (!borrowByBookId) {
      return;
    }

    borrowByBookId.forEach((borrow) => {
      this.display('----------');
      this.display(
        `Empréstimo ID: #${String(borrow.id)} Data empréstimo: ${formatDate(borrow.data_emprestimo)}`,
      );
      this.display(
        `Cliente: #${String(borrow.cliente_id)}: ${borrow.cliente_nome.toUpperCase()}\n`,
      );
      this.display('Livro(s):');

      borrow.livros.forEach((livro) => {
        this.display(
          `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
        );
        this.display(
          `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
        );
        this.display(
          `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn} `,
        );
        this.display(
          `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}`,
        );
        this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
      });
    });
    this.display('');
  }

  private async findBorrowByCustomer(): Promise<void> {
    this.display('\nPesquisando por cliente...');

    const customerId = await this.selectCustomer();

    if (!customerId) {
      return;
    }

    this.filter.clienteId = Number(customerId);
    const borrowByCustomerId = await this.borrowSrv.findBorrowFilter(
      this.filter,
    );

    if (!borrowByCustomerId) {
      return;
    }

    borrowByCustomerId.forEach((borrow) => {
      this.display('----------');
      this.display(
        `Empréstimo ID: #${String(borrow.id)} Data empréstimo: ${formatDate(borrow.data_emprestimo)}`,
      );
      this.display(
        `Cliente: #${String(borrow.cliente_id)}: ${borrow.cliente_nome.toUpperCase()}\n`,
      );
      this.display('Livro(s):');

      borrow.livros.forEach((livro) => {
        this.display(
          `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
        );
        this.display(
          `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
        );
        this.display(
          `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn}`,
        );
        this.display(
          `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Status: ${getBorrowStatusDescription(livro.status)}\n`,
        );
      });
    });

    this.display('');
  }

  private async findActiveBorrow(): Promise<void> {
    this.display('Listando empréstimos em aberto...');

    this.filter.status = 1;
    const listBorrowOpened = await this.borrowSrv.findBorrowFilter(this.filter);

    listBorrowOpened.forEach((borrow) => {
      this.display('----------');
      this.display(
        `Empréstimo ID: #${String(borrow.id)} Data empréstimo: ${formatDate(borrow.data_emprestimo)}`,
      );
      this.display(
        `Cliente: #${String(borrow.cliente_id)}: ${borrow.cliente_nome.toUpperCase()}\n`,
      );

      this.display(`Livro(s) aguardando devolução:`);

      borrow.livros.forEach((livro) => {
        this.display(
          `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
        );
        this.display(
          `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
        );
        this.display(
          `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn} `,
        );
        this.display(
          `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} `,
        );
        this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
      });
    });
    this.display('');
  }

  private async findAllBorrows(): Promise<void> {
    this.display('Buscando empréstimos...');
    this.display(' Informe o número da opção desejada:');
    this.display(' 1. Pesquisar por Empréstimo');
    this.display(' 2. Pesquisar por Livro');
    this.display(' 3. Pesquisar por Cliente');

    const optionSelected = await this.prompt('Opção: ');

    switch (optionSelected) {
      case '1':
        await this.findBorrowById();

        break;

      case '2':
        await this.findBorrowBybook();

        break;

      case '3':
        await this.findBorrowByCustomer();

        break;

      default:
        this.display('Opção inválida. Por favor, selecione uma opção válida.');
        break;
    }
  }

  private async createBorrow(): Promise<void> {
    this.display('Cadastrando empréstimo...');
    const borrowDto = await this.promptInteractiveForm(
      'Informe os dados do empréstimo: ',
      BorrowFormDto.schema(),
      BorrowFormDto,
    );

    const customerExists = await this.customerSrv.findCustomerById(borrowDto.cliente_id);
    if (!customerExists) {
      return;
    }

    const customerActive = await this.customerSrv.isCustomerActiveOrDeleted(borrowDto.cliente_id);

    if (!customerActive) {
      return;
    }

    const booksId: number[] = [];

    while (true) {
      const bookId = await this.prompt('Informe o ID do livro: ');
      const bookIdValidate = Number(bookId);
      if (Number.isNaN(bookIdValidate)) {
        this.display('ID do livro informado inválido.');
        continue;
      }      

      const bookExists = await this.bookSrv.findBookById(bookIdValidate);
      if (!bookExists) {
        continue;
      }

      const canBorrowBook = await this.borrowSrv.canBorrowBook(bookIdValidate);
      if (!canBorrowBook) {
        this.display('Não é possível emprestar este livro pois ele não está mais disponível.');
        return;
      }

      booksId.push(bookIdValidate);
      this.display(
        `Livro ${bookExists.titulo.toUpperCase()} adicionado ao empréstimo.`,
      );

      if (booksId.length === 5) {
        this.display(
          `Atingido a quantidade máxima de 5 livros por empréstimo.`,
        );
        break;
      }

      const confirmationAddBook = await this.confirmAction(
        'adicionar novo livro para este empréstimo',
        'Continuando...',
      );
      if (!confirmationAddBook) {
        break;
      }
    }

    if (booksId.length === 0) {
      this.display('O empréstimo deve possuir ao menos um livro!');
      return;
    }

    const confirmationCreate = await this.confirmAction(
      'gravar o empréstimo',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationCreate) {
      return;
    }

    const borrowCreated = await this.borrowSrv.createBorrow(
      { cliente_id: borrowDto.cliente_id },
      booksId,
      Number(Session.getUserId()),
    );

    if (!borrowCreated) {
      return;
    }

    this.display(`\nEmpréstimo cadastrado com sucesso!`);
  }

  private async cancelBorrow(): Promise<void> {
    this.display('Cancelamento de empréstimo...');

    this.display('\nPesquisando por Empréstimo...');

    const id = await this.prompt('Informe o ID do empréstimo: ');
    const borrowById = await this.borrowSrv.findBorrowById(Number(id));

    if (!borrowById) {
      return;
    }

    this.display('--------');
    this.display(
      `Empréstimo ID: #${borrowById.id} Data empréstimo: ${formatDate(borrowById.data_emprestimo)}`,
    );
    this.display(
      `Cliente: #${borrowById.cliente_id}: ${borrowById.cliente_nome.toUpperCase()}\n`,
    );
    this.display('Livro(s):');

    borrowById.livros.forEach((livro) => {
      this.display(
        `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
      );
      this.display(
        `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
      );
      this.display(
        `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn} `,
      );
      this.display(
        `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}`,
      );
      this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
    });

    this.display('');

    const canCancelBorrow = await this.borrowSrv.canCancelBorrow(borrowById.id);
    if (!canCancelBorrow) {
      return;
    }

    const confirmationCancelBorrow = await this.confirmAction(
      'cancelar todo o empréstimo, mesmo sendo ação irreversível',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationCancelBorrow) {
      return;
    }

    const borrowCanceled = await this.borrowSrv.cancelBorrow(borrowById.id);

    if (!borrowCanceled) {
      return;
    }

    this.display(`\nEmpréstimo cancelado com sucesso!`);
  }

  private async returnBorrow(): Promise<void> {
    this.display('Registrando devolução...');

    this.display('\nPesquisando por Empréstimo...');

    const returnId = await this.prompt('Informe o ID do empréstimo: ');
    const returnById = await this.borrowSrv.findBorrowById(Number(returnId));

    if (!returnById) {
      return;
    }

    const customerActive = await this.customerSrv.isCustomerActiveOrDeleted(returnById.cliente_id);

    if (!customerActive) {
      return;
    }

    this.display('----------');
    this.display(
      `Empréstimo ID: #${returnById.id} Data empréstimo: ${formatDate(returnById.data_emprestimo)}`,
    );
    this.display(
      `Cliente: #${returnById.cliente_id}: ${returnById.cliente_nome.toUpperCase()}\n`,
    );
    this.display('Livro(s):');

    returnById.livros.forEach((livro) => {
      this.display(
        `#${String(livro.id)} - ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
      );
      this.display(
        `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
      );
      this.display(
        `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn}`,
      );
      this.display(
        `Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)} • Devolução: ${livro.data_devolucao ? formatDate(livro.data_devolucao) : '- '}`,
      );
      this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
    });

    this.display('');

    const canReturnBorrow = await this.borrowSrv.canReturnBorrow(returnById.id);
    if (!canReturnBorrow) {     
      this.display( 'Não é possível realizar a devolução dos livros. Verifique o status do empréstimo.');         
      return;
    }

    this.display(
      `\nATENÇÃO! Confira os livros recebidos antes de finalizar a devolução!`,
    );
    const confirmationReturnBorrow = await this.confirmAction(
      'devolver todos os livros deste empréstimo',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationReturnBorrow) {
      return;
    }

    const borrowReturned = await this.borrowSrv.returnBorrow(returnById.id);

    if (!borrowReturned) {
      return;
    }

    this.display(`\nDevolução dos livros realizada com sucesso!`);
  }

  protected async update() {
    while (true) {
      this.display('');
      this.display(
        '____________________________________________________________',
      );
      this.display('                EMPRÉSTIMOS             ');
      this.display(
        '____________________________________________________________\n',
      );
      this.display(' Informe o número da opção desejada:');
      this.display(' 1. Listar empréstimos em aberto');
      this.display(' 2. Buscar empréstimos'); //Livro ou cliente
      this.display(' 3. Realizar empréstimo');
      this.display(' 4. Cancelar empréstimo');
      this.display(' 5. Registrar devolução');
      this.display(' 0. VOLTAR AO MENU PRINCIPAL');
      this.display(
        '____________________________________________________________\n',
      );

      const optionSelected = await this.prompt('Opção: ');

      switch (optionSelected) {
        case '1':
          await this.findActiveBorrow();
          break;

        case '2':
          await this.findAllBorrows();
          break;

        case '3':
          await this.createBorrow();
          break;

        case '4':
          await this.cancelBorrow();

          break;

        case '5':
          await this.returnBorrow();

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
