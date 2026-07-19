import { initDatabase, pool } from './infra/database/database';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { RelatorioPostgresRepository } from './infra/repositories/adapters/relatorio-postgres.pository';
import { AutorPostgresRepository } from './infra/repositories/adapters/autor-postgres.repository';
import { LivroPostgresRepository } from './infra/repositories/adapters/livro-postgres.repository';
import { ClientePostgresRepository } from './infra/repositories/adapters/cliente-postgres.repository';
import { EmprestimoPostgresRepository } from './infra/repositories/adapters/emprestimo-postgres.repository';
import { MunicipioPostgresRepository } from './infra/repositories/adapters/municipio-postgres.repository';
import { LoginService } from './services/login.service';
import { AuthorService } from './services/author.service';
import { BookService } from './services/book.service';
import { CustomerService } from './services/customer.service';
import { BorrowService } from './services/borrow.service';
import { MunicipalityService } from './services/municipality.service';
import { ReportService } from './services/report.service';
import { ReportView } from './view/report.view';
import { BorrowView } from './view/borrow.view';
import { BookView } from './view/book.view';
import { MainView } from './view/main.view';
import { AuthorView } from './view/author.view';
import { CustomerView } from './view/customer.view';

async function bootstrap() {
  await initDatabase();

  const loginService = new LoginService(new UsuarioPostgresRepository(pool));

  const authorService = new AuthorService(new AutorPostgresRepository(pool));
  const authorView = new AuthorView(authorService);

  const bookService = new BookService(new LivroPostgresRepository(pool),
    authorService,
  );
  const bookView = new BookView(bookService, authorService);

  const municipalityService = new MunicipalityService(
    new MunicipioPostgresRepository(pool),
  );

  const customerService = new CustomerService(
    new ClientePostgresRepository(pool),
  );
  const customerView = new CustomerView(customerService, municipalityService);

  const borrowService = new BorrowService(
    new EmprestimoPostgresRepository(pool),
  );
  const borrowView = new BorrowView(
    borrowService,
    bookService,
    customerService,
  );

  const reportService = new ReportService(
    new RelatorioPostgresRepository(pool),
  );
  const reportView = new ReportView(reportService, authorService);

  const mainView = new MainView(
    loginService,
    authorView,
    bookView,
    customerView,
    borrowView,
    bookService,
    reportView,
    authorService,
  );

  await mainView.start();
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((e: unknown) => {
    console.log('UNHANDLED REJECTION');
    console.error(e);
    process.exit(1);
  });
