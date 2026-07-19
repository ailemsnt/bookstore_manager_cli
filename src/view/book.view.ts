import { formatInChar, formatOutChar } from '../@common/utils/common.utils';
import { ConsoleView } from '../@common/view/console.view';
import { AuthorService } from '../services/author.service';
import { BookService } from '../services/book.service';
import { BookFormDto, BookUpdateDto } from './dto/book-form.dto';

export class BookView extends ConsoleView {
  constructor(
    private readonly bookSrv: BookService,
    private readonly authorSrv: AuthorService,
  ) {
    super();
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async findAllBooks(): Promise<void> {
    this.display('Listando acervo...');
    this.display('');

    const list = await this.bookSrv.findAllBooks();

    list.forEach((book) => {
      const authors = book.autores.map((author) => author.nome).join(', ');

      this.display(
        `${String(book.id)} - #${book.codigo}: ${book.titulo.toUpperCase()}`,
      );
      this.display(`Autor(es): ${authors}`);
      this.display(
        `Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}`,
      );
      this.display(`Baixado: ${formatOutChar(book.baixado)}\n`);
    });
  }

  private async findBookById(): Promise<void> {
    this.display('Buscando livro por ID...');

    const id = await this.prompt('Informe o ID do livro: ');
    const book = await this.bookSrv.findBookById(Number(id));
    this.display('');

    const authors = book.autores.map((author) => author.nome).join(', ');
    this.display(`${String(book.id)} - #${book.codigo}: ${book.titulo.toUpperCase()}`);
    this.display(`Autor(es): ${authors}`);
    this.display(
      `Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}`,
    );
    this.display(`Baixado: ${formatOutChar(book.baixado)}\n`);
  }

  private async createBook(): Promise<void> {
    this.display('Cadastrando livro...');
    const bookDto = await this.promptInteractiveForm(
      'Informe os dados do livro',
      BookFormDto.schema(),
      BookFormDto,
    );

    const authorsId: number[] = [];

    while (true) {
      const authorId = await this.prompt('Informe o ID do autor: ');
      const authorIdValidate = Number(authorId);
      if (Number.isNaN(authorIdValidate)) {
        this.display('ID do autor informado inválido.');
        continue;
      }

      const authorExists =
        await this.authorSrv.findAuthorById(authorIdValidate);
      if (!authorExists) {
        continue;
      }

      if (authorsId.includes(authorIdValidate)) {
        this.display('O Autor já foi adicionado ao livro');
        continue;
      }

      authorsId.push(authorIdValidate);
      this.display(`Autor ${authorExists.nome} adicionado ao livro.`);

      const confirmationAddAuthor = await this.confirmAction(
        'adicionar novo autor para este livro',
        'Continuando...',
      );
      if (!confirmationAddAuthor) {
        break;
      }
    }

    const bookOrError = await this.bookSrv
      .findBookByInternalCodeIsbn(bookDto.codigo, Number(bookDto.isbn))
      .catch((error: unknown) => error as Error);

    if (bookOrError instanceof Error) {
      this.reportTechnicalError(bookOrError);
      await this.prompt('Pressione ENTER para sair...');
      return;
    }

    if (bookOrError) {
      this.display(`Livro já cadastrado!`);
      return;
    }

    if (authorsId.length === 0) {
      this.display('O livro deve possuir ao menos um autor!');
      return;
    }

    const confirmationCreate = await this.confirmAction(
      'gravar o livro',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationCreate) {
      return;
    }

    const bookCreated = await this.bookSrv.createBook({
      titulo: bookDto.titulo,
      editora: bookDto.editora,
      edicao: bookDto.edicao,
      ano_publicacao: bookDto.ano_publicacao,
      baixado: formatInChar(bookDto.baixado),
      codigo: bookDto.codigo,
      isbn: bookDto.isbn,
      autores: authorsId,
    });

    if (!bookCreated) {
      return;
    }

    this.display(
      `\nLivro cadastrado com sucesso! Cod. int. ${bookCreated.codigo}: ${bookCreated.titulo.toUpperCase()}`,
    );
  }

  private async updateBook(): Promise<void> {
    this.display('Atualizando livro...');

    const idUpdate = await this.prompt(
      'Informe o ID do livro a ser atualizado: ',
    );
    await this.bookSrv.findBookById(Number(idUpdate));

    const bookUpdateDto = await this.promptInteractiveForm(
      'Informe os dados do livro',
      BookUpdateDto.schema(),
      BookUpdateDto,
    );

    const authorsIdUpdate: number[] = [];

    while (true) {
      const authorId = await this.prompt('Informe o ID do autor: ');
      const authorIdValidate = Number(authorId);
      if (Number.isNaN(authorIdValidate)) {
        this.display('ID do autor informado inválido.');
        continue;
      }

      const authorExists =
        await this.authorSrv.findAuthorById(authorIdValidate);
      if (!authorExists) {
        continue;
      }

      if (authorsIdUpdate.includes(authorIdValidate)) {
        this.display('O Autor já foi adicionado ao livro');
        continue;
      }

      authorsIdUpdate.push(authorIdValidate);
      this.display(`Autor ${authorExists.nome} adicionado ao livro.`);

      const confirmationAddAuthor = await this.confirmAction(
        'adicionar novo autor para este livro',
        'Continuando...',
      );
      if (!confirmationAddAuthor) {
        break;
      }
    }

    const bookUpdateOrError = await this.bookSrv
      .search(bookUpdateDto.titulo)
      .catch((error: unknown) => error as Error);

    if (bookUpdateOrError instanceof Error) {
      this.reportTechnicalError(bookUpdateDto);
      await this.prompt('Pressione ENTER para sair...');
      return;
    }

    const bookUpdated = await this.bookSrv.updateBook({
      id: Number(idUpdate),
      titulo: bookUpdateDto.titulo,
      editora: bookUpdateDto.editora,
      edicao: bookUpdateDto.edicao,
      ano_publicacao: bookUpdateDto.ano_publicacao,
      baixado: formatInChar(bookUpdateDto.baixado),
      autores: authorsIdUpdate,
    });

    this.display('');
    this.display(
      `Livro atualizado com sucesso! ID: ${String(bookUpdated.id)}, Título: ${bookUpdated.titulo}`,
    );
  }

  private async deleteBook(): Promise<void> {
    this.display('Excluindo livro...');

    const idDelete = await this.prompt(
      'Informe o ID do livro a ser excluído: ',
    );
    const bookDelete = await this.bookSrv.findBookById(Number(idDelete));

    const canDelete = await this.bookSrv.canDeleteBook(Number(idDelete));
    if (!canDelete) {
      return;
    }

    const confirmationDeleteBook = await this.confirmAction(
      `excluir o livro ${bookDelete.id} #${bookDelete.codigo} - ${bookDelete.titulo.toUpperCase()}`,
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationDeleteBook) {
      return;
    }

    await this.bookSrv.deleteBook(Number(idDelete));
    this.display('Livro excluído com sucesso!');
  }

  protected async update() {
    while (true) {
      this.display('');
      this.display(
        '____________________________________________________________',
      );
      this.display(
        '                           LIVROS                           ',
      );
      this.display(
        '____________________________________________________________\n',
      );
      this.display(' Informe o número da opção desejada:');
      this.display(' 1. Listar todo o acervo');
      this.display(' 2. Buscar livro por ID');
      this.display(' 3. Cadastrar livro');
      this.display(' 4. Atualizar livro');
      this.display(' 5. Excluir livro');
      this.display(' 0. VOLTAR AO MENU PRINCIPAL');
      this.display(
        '____________________________________________________________\n',
      );

      const optionSelected = await this.prompt('Opção: ');

      switch (optionSelected) {
        case '1':
          await this.findAllBooks();
          break;

        case '2':
          await this.findBookById();
          break;

        case '3':
          await this.createBook();
          break;

        case '4':
          await this.updateBook();
          break;

        case '5':
          await this.deleteBook();
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
