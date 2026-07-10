import { ConsoleView } from "../@common/view/console.view";
import { pool } from "../infra/database/database";
import { AutorPostgresRepository } from "../infra/repositories/adapters/autor-postgres.repository";
import { AuthorUseCase } from "../usecase/author.usecase";
import { AuthorFormDto } from "./dto/author-form.dto";

export class AuthorView extends ConsoleView {
  constructor(private readonly authorUc: AuthorUseCase)
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
      this.display('                AUTORES                 ')   
      this.display('________________________________________')
      this.display('')  
      this.display(" Informe o número da opção desejada:");
      this.display(" 1. Listar todos os autores");
      this.display(" 2. Buscar autor por ID");
      this.display(" 3. Cadastrar autor");
      this.display(" 4. Atualizar autor");
      this.display(" 5. Excluir autor");    
      this.display(" 6. VOLTAR AO MENU PRINCIPAL");
      this.display("________________________________________\n");
    
      const optionSelected = await this.prompt('Opção:');

      switch (optionSelected) {
        case '1':
          this.display('Listando autores...');
          
          const list = await this.authorUc.findAllAuthors();

          list.forEach((author) => {
            this.display(`ID: ${author.id}, Nome: ${author.nome}`);
          });
          break;          

        case '2':
          this.display('Buscando autor por ID...');

          const id = await this.prompt('Informe o ID do autor:');          
          const author = await this.authorUc.findAuthorById(Number(id));          

          this.display(`ID: ${author.id}, Nome: ${author.nome}`);
          break;

        case '3':
          this.display('Cadastrando autor...');
          const authorDto = await this.promptInteractiveForm('Informe o nome do autor',AuthorFormDto.schema(), AuthorFormDto);

          const authorOrError = await this.authorUc
          .search(authorDto.nome)
          .catch((error: unknown) => error as Error)

          if (authorOrError instanceof Error) {
            this.reportTechnicalError(authorOrError)
            await this.prompt('Pressione ENTER para sair...')
            return
          }
          
          if (authorOrError) {
            this.display(`Autor já cadastrado!`);
            return
          }

          const authorCreated = await this.authorUc.createAuthor({ nome: authorDto.nome});

          this.display(`Autor cadastrado com sucesso! ID: ${authorCreated.id}, Nome: ${authorCreated.nome}`);
          break;

        case '4':
          this.display('Atualizando autor...');
          
          const idUpdate = await this.prompt('Informe o ID do autor a ser atualizado:'); 
          await this.authorUc.findAuthorById(Number(idUpdate));

          const nameUpdate = await this.prompt('Informe o novo nome do autor:');
          const authorUpdated = await this.authorUc.updateAuthor(Number(idUpdate), nameUpdate);

          this.display(`Autor atualizado com sucesso! ID: ${authorUpdated.id}, Nome: ${authorUpdated.nome}`);
          break;

        case '5':
          this.display('Excluindo autor...');

          const idDelete = await this.prompt('Informe o ID do autor a ser excluído:');
          
          await this.authorUc.findAuthorById(Number(idDelete)); 
          //TODO: fazer validação se não foi cadastrado em livro
          await this.authorUc.deleteAuthor(Number(idDelete));
          this.display('Autor excluído com sucesso!');
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