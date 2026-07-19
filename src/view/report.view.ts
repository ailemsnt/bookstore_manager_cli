import {
  formatDate,
  formatOutChar,
  getCurrentDate,
} from '../@common/utils/common.utils';
import { ConsoleView } from '../@common/view/console.view';
import { AuthorService } from '../services/author.service';
import { ReportService } from '../services/report.service';
import { getBorrowStatusDescription } from './utils/view-utils';

export class ReportView extends ConsoleView {
  constructor(
    private readonly reportSrv: ReportService,
    private readonly authorSrv: AuthorService,
  ) {
    super();
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async listAvailableBooks(): Promise<void> {
    this.display(
      '\n================================================================================',
    );
    this.display(
      `   RELATÓRIO DE LIVROS DISPONÍVEIS PARA EMPRÉSTIMO - DATA GERAÇÃO ${formatDate(getCurrentDate())}`,
    );
    this.display(
      '================================================================================',
    );

    const listAvailable = await this.reportSrv.listAvailableBooks();

    if (!listAvailable || listAvailable.length === 0) {
      this.display('\n     SEM REGISTROS PARA EXIBIR\n ');
      this.display(
        '================================================================================\n',
      );
      return;
    }

    listAvailable.forEach((book, index) => {
      if (index > 0) {
        this.display('----------');
      }
      const authors = book.autores.map((author) => author.nome).join(', ');

      this.display(
        `#${String(book.id)} - Cod. int. ${book.codigo}: ${book.titulo.toUpperCase()}`,
      );
      this.display(`Autor(es): ${authors}`);
      this.display(
        `Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}\n`,
      );
    });

    this.display(
      '================================================================================',
    );
    this.display(`   TOTAL: ${String(listAvailable.length)} livros disponíveis`);
    this.display(
      '================================================================================\n',
    );
  }

  private async listUnavailableBooks(): Promise<void> {
    this.display(
      '\n================================================================================',
    );
    this.display(
      `        RELATÓRIO DE LIVROS EMPRESTADOS - DATA GERAÇÃO ${formatDate(getCurrentDate())}`,
    );
    this.display(
      '================================================================================',
    );

    const listUnavailable = await this.reportSrv.listUnavailableBooks();

    if (!listUnavailable || listUnavailable.length === 0) {
      this.display('\n     SEM REGISTROS PARA EXIBIR\n ');
      this.display(
        '================================================================================\n',
      );
      return;
    }

    listUnavailable.forEach((book, index) => {
      if (index > 0) {
        this.display('----------');
      }
      const authors = book.autores.map((author) => author.nome).join(', ');

      this.display(
        `#${String(book.id)} - Cod. int. ${book.codigo}: ${book.titulo.toUpperCase()}
        Autor(es): ${authors}
        Editora: ${book.editora} • ${book.edicao} • ${String(book.ano_publicacao)} • ISBN: ${book.isbn}
        Cliente: #${book.cliente_id} - ${book.cliente_nome}
        Previsão devolução: ${formatDate(book.data_prevista_devolucao)} • Status: ${getBorrowStatusDescription(book.status)}\n`,
      );
    });

    this.display(
      '================================================================================',
    );
    this.display(`   TOTAL: ${String(listUnavailable.length)} livros emprestados`);
    this.display(
      '================================================================================\n',
    );
  }

  private async listBooksByAuthor(): Promise<void> {
    const idAuthor = await this.prompt(
      'Buscar por ID do autor: (Deixe em branco para listar TODOS) ',
    );
    const author = idAuthor
      ? await this.authorSrv.findAuthorById(Number(idAuthor))
      : null;

    this.display(
      '\n================================================================================',
    );
    this.display(
      `        RELATÓRIO DE LIVROS CASTRADOS POR AUTOR - DATA GERAÇÃO ${formatDate(getCurrentDate())}`,
    );
    this.display(
      '================================================================================',
    );

    const listBooksByAuthor = await this.reportSrv.listBooksByAuthor(
      author?.id,
    );

    if (!listBooksByAuthor || listBooksByAuthor.length === 0) {
      this.display('\n     SEM REGISTROS PARA EXIBIR\n ');
      this.display(
        '================================================================================\n',
      );
      return;
    }

    listBooksByAuthor.forEach((author, index) => {
      if (index > 0) {
        this.display('----------');
      }

      this.display(`Autor: #${String(author.id)} ${author.nome.toUpperCase()}
      Livro(os): `);
      author.livros.forEach((book) => {
        this
          .display(`#${String(book.id)} - Cod. int. ${book.codigo}: ${book.titulo}              
        Editora: ${book.editora} • ${book.edicao} • ${String(book.ano_publicacao)} • ISBN: ${book.isbn}              
        Baixado: ${formatOutChar(book.baixado)}\n`);
      });
    });

    this.display(
      '================================================================================',
    );
    this.display(`   TOTAL: ${String(listBooksByAuthor.length)} autores listados`);
    this.display(
      '================================================================================\n',
    );
  }

  private async listBorrowsCountByBooks(): Promise<void> {
    this.display(
      '\n================================================================================',
    );
    this.display(
      `    RELATÓRIO DE QUANTIDADE DE EMPRÉSTIMOS POR LIVRO - DATA GERAÇÃO ${formatDate(getCurrentDate())}`,
    );
    this.display(
      '================================================================================',
    );

    const listBorrowBooks = await this.reportSrv.listBorrowsCountByBooks();

    if (!listBorrowBooks || listBorrowBooks.length === 0) {
      this.display('\n     SEM REGISTROS PARA EXIBIR\n ');
      this.display(
        '================================================================================\n',
      );
      return;
    }

    listBorrowBooks.forEach((book, index) => {
      if (index > 0) {
        this.display('----------');
      }
      const authors = book.autores.map((author) => author.nome).join(', ');

      this.display(
        `#${String(book.id)} - Cod. int. ${book.codigo}: ${book.titulo.toUpperCase()}`,
      );
      this.display(`Autor(es): ${authors}`);
      this.display(
        `Editora: ${book.editora} • ${book.edicao} • ${String(book.ano_publicacao)} • ISBN: ${book.isbn}`,
      );
      this.display(
        `Quantidade de empréstimos no intervalo informado: ${book.quantidade_emprestimo}\n`,
      );
    });

    this.display(
      '================================================================================',
    );
    this.display(`   TOTAL: ${String(listBorrowBooks.length)} livro(s)listados`);
    this.display(
      '================================================================================\n',
    );
  }

  private async listCustomerBorrowBooks(): Promise<void> {
    const idCustomer = await this.prompt(
      'Buscar por ID do cliente: (Deixe em branco para listar TODOS) ',
    );
    const customer = idCustomer
      ? await this.authorSrv.findAuthorById(Number(idCustomer))
      : null;

    const listCustomerBorrow = await this.reportSrv.listCustomerBorrowBooks(
      customer?.id,
    );

    this.display(
      '\n================================================================================',
    );
    this.display(
      `   RELATÓRIO DE CLIENTES COM EMPRÉSTIMO ATIVO - DATA GERAÇÃO ${formatDate(getCurrentDate())}`,
    );
    this.display(
      '================================================================================',
    );

    if (!listCustomerBorrow || listCustomerBorrow.length === 0) {
      this.display('\n     SEM REGISTROS PARA EXIBIR\n ');
      this.display(
        '================================================================================\n',
      );
      return;
    }

    listCustomerBorrow.forEach((borrow, index) => {      
      this.display(
        `\nCliente: #${String(borrow.cliente_id)}: ${borrow.cliente_nome.toUpperCase()}`,
      );

      borrow.livros.forEach((livro) => {
        this.display(
          `#${String(livro.id)} - Cod. int. ${livro.codigo}: ${livro.titulo.toUpperCase()}`,
        );
        this.display(
          `Autor(es): ${livro.autores.map((autor) => autor.nome).join(', ')}`,
        );
        this.display(
          `Editora: ${livro.editora} • ${livro.edicao} • ${String(livro.ano_publicacao)} • ISBN: ${livro.isbn} `,
        );
        this.display(
          `Empréstimo #${String(borrow.id)} • Data empréstimo: ${formatDate(borrow.data_emprestimo)} • Data prevista devolução: ${formatDate(livro.data_prevista_devolucao)}`,
        );
        this.display(`Status: ${getBorrowStatusDescription(livro.status)}\n`);
      });

      this.display('----------------------------------------');
      this.display(
        `   TOTAL: ${String(borrow.livros.length)} livro(s) emprestado(s)`,
      );
      this.display(
        '--------------------------------------------------------------------------------',
      );
    });

    this.display(
      '================================================================================\n',
    );
  }

  protected async update() {
    while (true) {
      this.display('');
      this.display(
        '____________________________________________________________',
      );
      this.display(
        '                          RELATÓRIOS                        ',
      );
      this.display(
        '____________________________________________________________\n',
      );
      this.display(' Informe o número da opção desejada:');
      this.display(' 1. Relatório de livros disponíveis para empréstimo');
      this.display(' 2. Relatório de livros atualmente emprestados');
      this.display(' 3. Relatório de livros cadastrados por autor');
      this.display(' 4. Relatório de quantidade de empréstimos por livro');
      this.display(' 5. Relatório de clientes com empréstimo ativo');
      this.display(' 0. VOLTAR AO MENU PRINCIPAL');
      this.display(
        '____________________________________________________________\n',
      );

      const optionSelected = await this.prompt('Opção:');

      switch (optionSelected) {
        case '1':
          await this.listAvailableBooks();
          break;

        case '2':
          await this.listUnavailableBooks();
          break;

        case '3':
          await this.listBooksByAuthor();
          break;

        case '4':
          await this.listBorrowsCountByBooks();
          break;

        case '5':
          await this.listCustomerBorrowBooks();
          break;
        // case '6':
        //   this.display('Iniciando empréstimo...');

        //   break;

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
