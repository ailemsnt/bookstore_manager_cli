import { initDatabase, pool } from './infra/database/database';
import { LoginUseCase } from './usecase/login.usecase';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { MainView } from './view/main.view';
import { AuthorView } from './view/author.view';
import { AuthorUseCase } from './usecase/author.usecase';
import { AutorPostgresRepository } from './infra/repositories/adapters/autor-postgres.repository';
import { BookUseCase } from './usecase/book.usecase';
import { LivroPostgresRepository } from './infra/repositories/adapters/livro-postgres.repository';
import { BookView } from './view/book.view';
import { ClientePostgresRepository } from './infra/repositories/adapters/cliente-postgres.repository';
import { CustomerView } from './view/customer.view';
import { CustomerUseCase } from './usecase/customer.usecase';
import { BorrowUseCase } from './usecase/borrow.usecase';
import { EmprestimoPostgresRepository } from './infra/repositories/adapters/emprestimo-postgres.repository';
import { BorrowView } from './view/borrow.view';
import { MunicipalityUseCase } from './usecase/municipality.usecase';
import { MunicipioPostgresRepository } from './infra/repositories/adapters/municipio-postgres.repository';
import { ReportUseCase } from './usecase/report.usecase';
import { RelatorioPostgresRepository } from './infra/repositories/adapters/relatorio-postgres.pository';
import { ReportView } from './view/report.view';

async function bootstrap() {
  await initDatabase();

  const loginUseCase = new LoginUseCase(new UsuarioPostgresRepository(pool));

  const authorUseCase = new AuthorUseCase(new AutorPostgresRepository(pool));
  const authorView = new AuthorView(authorUseCase);

  const bookUseCase = new BookUseCase(new LivroPostgresRepository(pool), authorUseCase);
  const bookView = new BookView(bookUseCase, authorUseCase);

  const municipalityUseCase = new MunicipalityUseCase(new MunicipioPostgresRepository(pool));

  const customerUseCase = new CustomerUseCase(new ClientePostgresRepository(pool));
  const customerView = new CustomerView(customerUseCase,municipalityUseCase);

  const borrowUseCase = new BorrowUseCase(new EmprestimoPostgresRepository(pool));
  const borrowView = new BorrowView(borrowUseCase, bookUseCase);
  
  const reportUseCase = new ReportUseCase(new RelatorioPostgresRepository(pool));
  const reportView = new ReportView(reportUseCase, authorUseCase);

  const mainView = new MainView(loginUseCase, authorView, bookView, customerView, borrowView, bookUseCase, reportView, authorUseCase);

  await mainView.start()
}

bootstrap()
  .then(() => {
    process.exit(0)
  })
  .catch((e: unknown) => {
    console.log('UNHANDLED REJECTION')
    console.error(e)
    process.exit(1)
  })