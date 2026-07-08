import { ConsoleView } from "../@common/view/console.view";
import { pool } from "../infra/database/database";
import { LivroPostgresRepository } from "../infra/repositories/adapters/livro.postgres.repository";
import { BookUseCase } from "../usecase/book.usecase";
import { BookFormDto } from "./dto/book-form.dto";

export class BookView extends ConsoleView {
  constructor(private readonly bookUc: BookUseCase)
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
      this.display('                LIVROS                  ')   
      this.display('________________________________________\n')     
      this.display(" Informe o número da opção desejada:");
      this.display(" 1. Listar todos o acervo");
      this.display(" 2. Buscar livro por ID");
      this.display(" 3. Cadastrar livro");
      this.display(" 4. Atualizar livro");
      this.display(" 5. Excluir livro");    
      this.display(" 6. VOLTAR AO MENU PRINCIPAL");
      this.display("________________________________________\n");
    
      const optionSelected = await this.prompt('Opção:');

      switch (optionSelected) {
        case '1':
          this.display('Listando acervo...');

          const bookUseCase = new BookUseCase(new LivroPostgresRepository(pool));
          const list = await bookUseCase.findAllBooks();

          list.forEach((book) => {
            this.display(`ID: ${book.id}, Título: ${book.titulo}, Autor: ${book.autor}, Editora: ${book.editora}, Edição: ${book.edicao}, Publicação: ${book.ano_publicacao}, Diposponível empréstimo: ${book.disponivel} ? "Sim", "Não"`);
          });
          break;          

        case '2':
          this.display('Buscando livro por ID...');

          const id = await this.prompt('Informe o ID do livro:');
          const bookUseCaseById = new BookUseCase(new LivroPostgresRepository(pool));
          const book = await bookUseCaseById.findBookById(Number(id));          

          this.display(`ID: ${book.id}, Título: ${book.titulo}, Autor: ${book.autor}, Editora: ${book.editora}, Edição: ${book.edicao}, Publicação: ${book.ano_publicacao}, Diposponível empréstimo: ${book.disponivel} ? "Sim", "Não"`);
          break;

        case '3':
          this.display('Cadastrando livro...');
          const bookDto = await this.promptInteractiveForm('Informe o nome do livro',BookFormDto.schema(), BookFormDto);

          const bookOrError = await this.bookUc
          .search(bookDto.titulo)
          .catch((error: unknown) => error as Error)

          if (bookOrError instanceof Error) {
            this.reportTechnicalError(bookOrError)
            await this.prompt('Pressione ENTER para sair...')
            return
          }
          
          if (bookOrError) {
            this.display(`Livro já cadastrado!`);
            return
          }

          const bookUseCaseCreate = new BookUseCase(new LivroPostgresRepository(pool));
          const bookCreated = await bookUseCaseCreate.createBook({ titulo: bookDto.titulo, autor_id: Number(bookDto.autor_id), editora: bookDto.editora, edicao: bookDto.edicao, ano_publicacao: Number(bookDto.ano_publicacao), disponivel: bookDto.disponivel === "S" ? 1 : 0, codigo: bookDto.codigo, isbn: bookDto.isbn, data_cadastro: new Date()});

          this.display(`Livro cadastrado com sucesso! ID: ${bookCreated.id}, Título: ${bookCreated.titulo}`);
          break;

        case '4':
          this.display('Atualizando livro...');
          
          const idUpdate = await this.prompt('Informe o ID do livro a ser atualizado:');          
          const bookUseCaseUpdate = new BookUseCase(new LivroPostgresRepository(pool));
          await bookUseCaseUpdate.findBookById(Number(idUpdate));
          const titleUpdate = await this.prompt('Informe o novo título do livro:');
          const authorUpdate = await this.prompt('Informe o novo autor:');
          const publisherUpdate = await this.prompt('Informe a nova editora:');
          const editionUpdate = await this.prompt('Informe a nova edição:');
          const yearUpdate = await this.prompt('Informe novo ano de publicação:');
          const instockUpdate = await this.prompt('Informe a nova disponibilidade para empréstimos: (S ou N)');

          const bookUpdated = await bookUseCaseUpdate.updateBook(Number(idUpdate), titleUpdate, Number(authorUpdate), publisherUpdate, editionUpdate, Number(yearUpdate), instockUpdate === "S" ? 1 : 0);

          this.display(`Livro atualizado com sucesso! ID: ${bookUpdated.id}, Título: ${bookUpdated.titulo}`);
          break;

        case '5':
          this.display('Excluindo livro...');

          const idDelete = await this.prompt('Informe o ID do livro a ser excluído:');
          const authorUseCaseDelete = new BookUseCase(new LivroPostgresRepository(pool));
          await authorUseCaseDelete.findBookById(Number(idDelete)); 
          //TODO: fazer validação se não foi emprestado
          await authorUseCaseDelete.deleteBook(Number(idDelete));
          this.display('Livro excluído com sucesso!');
          break;

        case '6': 
          this.display('Voltando ao menu principal...');              
          return
        default:
          this.display('Opção inválida. Por favor, selecione uma opção válida.');
          break;
      }
    }
  }
}