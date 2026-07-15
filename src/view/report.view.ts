import { AuthorUseCase } from './../usecase/author.usecase';
import { formatDate, formatOutChar } from "../@common/utils/common.utils";
import { ConsoleView } from "../@common/view/console.view";
import { ReportUseCase } from "../usecase/report.usecase";

let total = 0;
const dataAtual = new(Date);
export class ReportView extends ConsoleView {
  constructor(private readonly reportUc: ReportUseCase, private readonly authorUc: AuthorUseCase)
  { 
    super(); 
  }
  
  async start(): Promise<void> {
    await this.update();
  }

  protected async update(){
    while (true) {
      this.display('')
      this.display('________________________________________');
      this.display('                RELATÓRIOS              ');   
      this.display('________________________________________\n');     
      this.display(" Informe o número da opção desejada:");
      this.display(" 1. Resumo de livros disponíveis para empréstimo");        
      this.display(" 2. Resumo de livros atualmente emprestados"); 
      this.display(" 3. Resumo de livros cadastrados por autor");
      this.display(" 4. Resumo de quantidade de empréstimos por livro");
      this.display(" 5. Resumo de clientes com empréstimo ativo");//--
      this.display(" 6. Resumo de livros que não podem mais ser emprestados");
      this.display(" 7. Ranking de assiduidade de clientes");
      this.display(" 8. Ranking de populareidade de autores");
      this.display(" 9. .....");          
      this.display(" 0. VOLTAR AO MENU PRINCIPAL");
      this.display("________________________________________\n");
    
      const optionSelected = await this.prompt('Opção:');         

      switch (optionSelected) {
        case '1':            
          this.display('\n================================================================================');
          this.display(`   RELATÓRIO DE LIVROS DISPONÍVEIS PARA EMPRÉSTIMO - DATA GERAÇÃO ${formatDate(dataAtual)}`);  
          this.display('================================================================================');

          const listAvailable = await this.reportUc.listAvailableBooks();
          
          total = 0;
          listAvailable.forEach((book) => {
            total++; 

            if (total > 1) {
              this.display('----------------------------------------');  
            }
            const authors = book.autor.map((author) => author.nome).join(', ');
          
            this.display(
              `${book.id} - #${book.codigo}: ${(book.titulo).toUpperCase()}
              Autor(es): ${authors}
              Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}\n`);              
          });
          this.display('================================================================================');
          this.display(`   TOTAL DISPONÍVEL: ${total}`);  
          this.display('================================================================================\n');

          break;          

        case '2':
          this.display('\n================================================================================');
          this.display(`        RELATÓRIO DE LIVROS EMPRESTADOS - DATA GERAÇÃO ${formatDate(dataAtual)}`);  
          this.display('================================================================================');

          const listUnavaliable = await this.reportUc.listUnavailableBooks();
          
          total = 0;
          listUnavaliable.forEach((book) => {
            total++; 

            if (total > 1) {
              this.display('----------------------------------------');  
            }
            const authors = book.autor.map((author) => author.nome).join(', ');
          
            this.display(
              `${book.id} - #${book.codigo}: ${(book.titulo).toUpperCase()}
              Autor(es): ${authors}
              Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}
              Cliente: #${book.cliente_id} - ${book.cliente_nome}
              Data empréstimo: ${formatDate(book.data_emprestimo)} • Previsão devolução: ${formatDate(book.data_prevista_devolucao)} • Status: ${book.status}\n`);              
          });
          this.display('================================================================================');
          this.display(`   TOTAL: ${total}`);  
          this.display('================================================================================\n');

          break;

        case '3':
          this.display('\n================================================================================');
          this.display(`        RELATÓRIO DE LIVROS CASTRADOS POR AUTOR - DATA GERAÇÃO ${formatDate(dataAtual)}`);  
          this.display('================================================================================');
          
          const idAuthor = await this.prompt('Buscar por ID do autor: (Deixe em branco para listar TODOS) ');                                      
          const author = idAuthor ? await this.authorUc.findAuthorById(Number(idAuthor)) : null;          

          const listBooksByAuthor = await this.reportUc.listBooksByAuthor(author?.id);

          total = 0;
          listBooksByAuthor.forEach((author) => {
            total++; 

            if (total > 1) {
              this.display('----------------------------------------');  
            }
          
            this.display(`Autor: #${author.id} ${(author.nome).toUpperCase()}
            Livro(os): `);
            author.livros.forEach((book) => {
              this.display(`${book.id} - #${book.codigo}: ${book.titulo}              
              Editora: ${book.editora} • ${book.edicao} • ${book.ano_publicacao} • ISBN: ${book.isbn}              
              Baixado: ${formatOutChar(book.baixado)}\n`);
            });
          });

          break;

        case '4':
          this.display('Buscando empréstimos por Data de inclusão...');

          break;

        case '5':
          this.display('Buscando empréstimos por Data de devolução...');

          break;  
        case '6':
          this.display('Iniciando empréstimo...');

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