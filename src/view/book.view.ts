import { formatInChar, formatOutChar } from "../@common/utils/common.utils";
import { ConsoleView } from "../@common/view/console.view";
import { BookUseCase } from "../usecase/book.usecase";
import { BookFormDto, BookUpdateDto } from "./dto/book-form.dto";

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
      this.display(" 1. Listar todo o acervo");
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
          
          const list = await this.bookUc.findAllBooks();

          list.forEach((book) => {
            this.display(`ID: ${book.id}, Título: ${book.titulo}, Autor: ${book.autor_id}, Editora: ${book.editora}, Edição: ${book.edicao}, Publicação: ${book.ano_publicacao}, Disponível empréstimo: ${formatOutChar(book.disponivel)}`);
          });
          break;          

        case '2':
          this.display('Buscando livro por ID...');

          const id = await this.prompt('Informe o ID do livro:');          
          const book = await this.bookUc.findBookById(Number(id));          

          this.display(`ID: ${book.id}, Título: ${book.titulo}, Autor: ${book.autor_id}, Editora: ${book.editora}, Edição: ${book.edicao}, Publicação: ${book.ano_publicacao}, Disponível empréstimo: ${formatOutChar(book.disponivel)}`);
          break;

        case '3':
          this.display('Cadastrando livro...');
          const bookDto = await this.promptInteractiveForm('Informe os dados do livro',BookFormDto.schema(), BookFormDto);

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
          
          const bookCreated = await this.bookUc.createBook({ titulo: bookDto.titulo, autor_id: Number(bookDto.autor_id), editora: bookDto.editora, edicao: bookDto.edicao, ano_publicacao: Number(bookDto.ano_publicacao), disponivel: formatInChar(bookDto.disponivel), codigo: bookDto.codigo, isbn: bookDto.isbn});

          this.display(`Livro cadastrado com sucesso! Título: ${bookCreated.titulo}, Autor: ${bookCreated.autor_id}`);
          break;

        case '4':
          this.display('Atualizando livro...');
          
          
          const idUpdate = await this.prompt('Informe o ID do livro a ser atualizado:'); 
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
        
          const bookUpdated = await this.bookUc.updateBook( {id: Number(idUpdate), titulo: bookUpdateDto.titulo, autor_id: Number(bookUpdateDto.autor_id), editora: bookUpdateDto.editora, edicao: bookUpdateDto.edicao, ano_publicacao: Number(bookUpdateDto.ano_publicacao), disponivel: formatInChar(bookUpdateDto.disponivel)});

          this.display(`Livro atualizado com sucesso! ID: ${bookUpdated.id}, Título: ${bookUpdated.titulo}`);
          break;

        case '5':
          this.display('Excluindo livro...');

          const idDelete = await this.prompt('Informe o ID do livro a ser excluído:');          
          await this.bookUc.findBookById(Number(idDelete)); 

          //TODO: fazer validação se não foi emprestado ?
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