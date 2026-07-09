import { BookView } from './book.view';
import { AuthorView } from './author.view';
import { ConsoleView } from "../@common/view/console.view"
import { LoginUseCase } from "../usecase/login.usecase"
import { LoginUserDto } from "./dto/login-user-form.dto"
import { CustomerView } from './customer.view';

export class MainView extends ConsoleView {
  constructor(private readonly loginUc: LoginUseCase, private readonly authorView: AuthorView, private readonly bookView: BookView, private readonly costumerView: CustomerView) {
    super(true)
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('   Bem-vindo ao Acervo CLI              ')
    this.display('   Sistema de Gestão de Biblioteca      ')
    this.display('========================================')
    this.display('')

    const loginUserDto = await this.promptInteractiveForm(
      `Informe os dados do usuário`,
      LoginUserDto.schema(),
      LoginUserDto
    )

    const userOrError = await this.loginUc
      .search(loginUserDto.login, loginUserDto.senha)
      .catch((error: unknown) => error as Error)

    if (userOrError instanceof Error) {
      this.reportTechnicalError(userOrError)
      await this.prompt('Pressione ENTER para sair...')
      return
    }

    if (!userOrError) {
      this.showError('Usuário ou senha inválidos. Tente novamente.')
      await this.prompt('Pressione ENTER para sair...')
      return
    }

    //await this.prompt(
    this.display(`Usuário ${JSON.stringify(loginUserDto.login)} logado com sucesso!`);
    ///)
    while (true) {
      this.display('')
      this.display('========================================')
      this.display('                  MENU                  ')   
      this.display('========================================')
      this.display('')
      this.display(" INSTRUÇÕES DE USO:");
      this.display(" Gerencie empréstimos de livros.\n");
      this.display(" Informe o número da opção desejada:");
      this.display(" 1. AUTORES ");
      this.display(" 2. LIVROS");
      this.display(" 3. CLIENTES");
      this.display(" 4. EMPRÉSTIMOS");
      this.display(" 5. DEVOLUÇÕES");
      this.display(" 6. RELATÓRIOS");
      this.display(" 7. Sair");
      this.display("========================================\n");
    
      const optionSelected = await this.prompt('Opção:');

      switch (optionSelected) {
        case '1':
          this.display('Acessando autores...');     
          await this.authorView.start();
          break
        case '2':
          this.display('Acessando livros...');          
          await this.bookView.start();
          break;
        case '3':
          this.display('Acessando clientes...');
          await this.costumerView.start();
          break;
        case '4':
          this.display('Acessando empréstimos...');
          break;
        case '5':
          this.display('Acessando devoluções...');
          break;
        case '6':
          this.display('Acessando relatórios...');
          break;
        case '7':
          this.display('Saindo do sistema...');
          this.exit()
          return
        default:
          this.display('Opção inválida. Por favor, selecione uma opção válida.');
          break;
      }
    }
  }
}