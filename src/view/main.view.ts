import { ConsoleView } from "../@common/view/console.view"
import { LoginUseCase } from "../usecase/login.usecase"
import { LoginUserDto } from "./dto/login-user-form.dto"

export class MainView extends ConsoleView {
  constructor(private readonly loginUc: LoginUseCase) {
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

    await this.prompt(
      `Usuário ${JSON.stringify(userOrError)} logado com sucesso!`
    )
    await this.prompt('Pressione ENTER para sair...')
    this.exit()
  }
}