import { ConsoleView } from '../@common/view/console.view';
import { AuthorService } from '../services/author.service';
import { AuthorFormDto } from './dto/author-form.dto';
export class AuthorView extends ConsoleView {
  constructor(private readonly authorSrv: AuthorService) {
    super();
  }

  async start(): Promise<void> {
    await this.update();
  }

  private async listAllAuthors(): Promise<void> {
    this.display('Listando autores...');

    const list = await this.authorSrv.findAllAuthors();

    list.forEach((author) => {
      this.display(`#${String(author.id)} ${author.nome.toUpperCase()}`);
    });
  }

  private async listAuthorById(): Promise<void> {
    this.display('Buscando autor por ID...');

    const id = await this.prompt('Informe o ID do autor: ');
    const author = await this.authorSrv.findAuthorById(Number(id));

    this.display(`#${String(author.id)} - ${author.nome.toUpperCase()}`);
  }

  private async createAuthor(): Promise<void> {
    this.display('Cadastrando autor...');
    const authorDto = await this.promptInteractiveForm(
      'Informe o nome do autor ',
      AuthorFormDto.schema(),
      AuthorFormDto,
    );

    const authorOrError = await this.authorSrv
      .search(authorDto.nome)
      .catch((error: unknown) => error as Error);

    if (authorOrError instanceof Error) {
      this.reportTechnicalError(authorOrError);
      await this.prompt('Pressione ENTER para sair...');
      return;
    }

    if (authorOrError) {
      this.display(`Autor já cadastrado!`);
      return;
    }

    const confirmationCreate = await this.confirmAction(
      'gravar o autor',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationCreate) {
      return;
    }

    const authorCreated = await this.authorSrv.createAuthor({
      nome: authorDto.nome,
    });

    this.display(
      `Autor cadastrado com sucesso! ID: ${String(authorCreated.id)} - Nome: ${authorCreated.nome.toUpperCase()}`,
    );
  }

  private async updateAuthor(): Promise<void> {
    this.display('Atualizando autor...');

    const idUpdate = await this.prompt(
      'Informe o ID do autor a ser atualizado: ',
    );
    const authorUpdate = await this.authorSrv.findAuthorById(Number(idUpdate));

    this.display(`Autor encontrado: ${authorUpdate.nome}`);

    const nameUpdate = await this.prompt('Informe o novo nome do autor: ');
    const confirmationUpdate = await this.confirmAction(
      'gravar o autor',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationUpdate) {
      return;
    }

    const authorUpdated = await this.authorSrv.updateAuthor(
      Number(idUpdate),
      nameUpdate,
    );

    this.display(
      `Autor ID: ${authorUpdated.id} - Nome: ${authorUpdated.nome} atualizado com sucesso!`,
    );
  }

  private async deleteAuthor(): Promise<void> {
    this.display('Excluindo autor...');

    const idDelete = await this.prompt('Informe o ID do autor a ser excluído:');

    const authorDelete = await this.authorSrv.findAuthorById(Number(idDelete));

    this.display(`Autor encontrado: ${authorDelete.nome}`);

    const canDelete = await this.authorSrv.canDeleteAuthor(Number(idDelete));
    if (!canDelete) {
      return;
    }

    const confirmationDelete = await this.confirmAction(
      'excluir o autor',
      'Operação cancelada pelo usuário.',
    );
    if (!confirmationDelete) {
      return;
    }
    await this.authorSrv.deleteAuthor(Number(idDelete));
    this.display('Autor excluído com sucesso!');
  }

  protected async update() {
    while (true) {
      this.display('');
      this.display(
        '____________________________________________________________',
      );
      this.display(
        '                          AUTORES                           ',
      );
      this.display(
        '____________________________________________________________',
      );
      this.display('');
      this.display(' Informe o número da opção desejada:');
      this.display(' 1. Listar todos os autores');
      this.display(' 2. Buscar autor por ID');
      this.display(' 3. Cadastrar autor');
      this.display(' 4. Atualizar autor');
      this.display(' 5. Excluir autor');
      this.display(' 0. VOLTAR AO MENU PRINCIPAL');
      this.display(
        '____________________________________________________________\n',
      );

      const optionSelected = await this.prompt('Opção: ');

      switch (optionSelected) {
        case '1':
          await this.listAllAuthors();
          break;

        case '2':
          await this.listAuthorById();
          break;

        case '3':
          await this.createAuthor();
          break;

        case '4':
          await this.updateAuthor();
          break;

        case '5':
          await this.deleteAuthor();
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
