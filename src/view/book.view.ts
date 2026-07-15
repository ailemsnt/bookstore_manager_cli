import { formatInChar, formatOutChar } from "../@common/utils/common.utils";
import { ConsoleView } from "../@common/view/console.view";
import { AuthorUseCase } from "../usecase/author.usecase";
import { BookUseCase } from "../usecase/book.usecase";
import { BookFormDto, BookUpdateDto } from "./dto/book-form.dto";

export class BookView extends ConsoleView {
  constructor(private readonly bookUc: BookUseCase, private readonly authorUc: AuthorUseCase)
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
      this.display(" 1. Listar todo o acervo");
      this.display(" 2. Buscar livro por ID");
      this.display(" 3. Cadastrar livro");
      this.display(" 4. Atualizar livro");
      this.display(" 5. Excluir livro");    
      this.display(" 0. VOLTAR AO MENU PRINCIPAL");
      this.display("________________________________________\n");
    
      const optionSelected = await this.prompt('Opção: ');         

      switch (optionSelected) {
        case '1':
          this.display('Listando acervo...');
          
          const list = await this.bookUc.findAllBooks();

          list.forEach((book) => {
            const authors = book.autor.map((author) => author.nome).join(', ');
          
            this.display(
              `${book.id} - #${book.codigo}: ${(book.titulo).toUpperCase()}
              Autor(es): ${authors}
              Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn} 
              Baixado: ${formatOutChar(book.baixado)}\n`);
          });
          break;          

        case '2':
          this.display('Buscando livro por ID...');

          const id = await this.prompt('Informe o ID do livro: ');          
          const book = await this.bookUc.findBookById(Number(id));   
          
          const authors = book.autor.map((author) => author.nome).join(', ');
          this.display(
              `${book.id} - #${book.codigo}: ${(book.titulo).toUpperCase()}
              Autor(es): ${authors}
              Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn} 
              Baixado: ${formatOutChar(book.baixado)}\n`);
          break;

        case '3':
          this.display('Cadastrando livro...');
          const bookDto = await this.promptInteractiveForm('Informe os dados do livro',BookFormDto.schema(), BookFormDto);

          const authorsId: number[] = [];

          while (true) {
            const authorId = await this.prompt('Informe o ID do autor: ');
            const authorIdValidate = Number(authorId);
            if (Number.isNaN(authorIdValidate)) {
              this.display('ID do autor informado inválido.');
              break;
            } 

            const authorExists = await this.authorUc.findAuthorById(authorIdValidate);
            if (!authorExists) {            
              break;
            }
            
            authorsId.push(authorIdValidate);
            this.display(`Autor ${authorExists.nome} adicionado ao livro.`);

            const confirmationAddAuthor = await this.confirmAction('adicionar novo autor para este livro');
            if (!confirmationAddAuthor) {
              break;
            }            
          }

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
          
          if (authorsId.length === 0) {
            this.display('O livro deve possuir ao menos um autor!');
            return
          }

          const confirmationCreate = await this.confirmAction('gravar o livro');
          if (!confirmationCreate) {
            return;
          }
          
          const bookCreated = await this.bookUc.createBook({ titulo: bookDto.titulo, editora: bookDto.editora, edicao: bookDto.edicao, ano_publicacao: Number(bookDto.ano_publicacao), baixado: formatInChar(bookDto.baixado), codigo: bookDto.codigo, isbn: bookDto.isbn, 
          autores: authorsId
          });

          this.display(
              `\nLivro cadastrado com sucesso! ID: ${bookCreated.id} - #${bookCreated.codigo}: ${(bookCreated.titulo).toUpperCase()}`);
          break;

        case '4':
          this.display('Atualizando livro...');
          
          
          const idUpdate = await this.prompt('Informe o ID do livro a ser atualizado: '); 
          await this.bookUc.findBookById(Number(idUpdate));  

          const bookUpdateDto = await this.promptInteractiveForm('Informe os dados do livro',BookUpdateDto.schema(), BookUpdateDto);

          const bookUpdateOrError = await this.bookUc
          .search(bookUpdateDto.titulo)
          .catch((error: unknown) => error as Error)

          if (bookUpdateOrError instanceof Error) {
            this.reportTechnicalError(bookUpdateDto)
            await this.prompt('Pressione ENTER para sair...')
            return
          }
        
          // const bookUpdated = await this.bookUc.updateBook( {id: Number(idUpdate), titulo: bookUpdateDto.titulo, autor_id: Number(bookUpdateDto.autor_id), editora: bookUpdateDto.editora, edicao: bookUpdateDto.edicao, ano_publicacao: Number(bookUpdateDto.ano_publicacao), baixado: formatInChar(bookUpdateDto.baixado)});

          // this.display(`Livro atualizado com sucesso! ID: ${bookUpdated.id}, Título: ${bookUpdated.titulo}`);
          break;

        case '5':
          this.display('Excluindo livro...');

          const idDelete = await this.prompt('Informe o ID do livro a ser excluído: ');          
          const bookDelete = await this.bookUc.findBookById(Number(idDelete)); 

          const canDelete = await this.bookUc.canDeleteBook(Number(idDelete));    
          if (!canDelete) {
            return;
          }

          const confirmationDeleteBook = await this.confirmAction(`excluir o livro ${bookDelete.id} #${bookDelete.codigo} - ${(bookDelete.titulo).toUpperCase()}`);
            if (!confirmationDeleteBook) {
              break;
            }  

          await this.bookUc.deleteBook(Number(idDelete));
          this.display('Livro excluído com sucesso!');
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